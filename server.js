import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as loggerExpress from 'logger-express';
import { nanoid } from 'nanoid';
import request from 'supertest';

import { 
  usuariosPool, 
  categoriasPool, 
  publicacionesPool, 
  comprasPool, 
  detallesComprasPool 
} from './database/config.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Implementar CORS
app.use(express.json());
app.use(morgan('dev'));
app.use(loggerExpress.logger());

// Middleware para validar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta para registrar usuarios
app.post('/api/users/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const result = await poolUsuarios.query(
    'INSERT INTO usuarios (id, correo, contraseña) VALUES ($1, $2, $3) RETURNING *',
    [nanoid(), email, hashedPassword]
  );

  const user = result.rows[0];
  const token = jwt.sign({ id: user.id, email: user.correo }, process.env.JWT_SECRET);
  
  res.json({ token, user });
});

// Ruta para iniciar sesión
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  
  const result = await poolUsuarios.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
  const user = result.rows[0];
  
  if (!user || !(await bcrypt.compare(password, user.contraseña))) {
    return res.status(400).json({ error: 'Email or password is incorrect' });
  }

  const token = jwt.sign({ id: user.id, email: user.correo }, process.env.JWT_SECRET);
  
  res.json({ token, user });
});

// Ruta para obtener el perfil del usuario
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const result = await poolUsuarios.query('SELECT id, correo FROM usuarios WHERE id = $1', [userId]);
  
  res.json({ user: result.rows[0] });
});

// Ruta para crear publicaciones
app.post('/api/posts', authenticateToken, async (req, res) => {
  const { title, content, categoryId } = req.body;
  
  const result = await poolPublicaciones.query(
    'INSERT INTO publicaciones (titulo, descripcion, categoria_id) VALUES ($1, $2, $3) RETURNING *',
    [title, content, categoryId]
  );

  res.json({ post: result.rows[0] });
});

// Ruta para obtener publicaciones
app.get('/api/posts', async (req, res) => {
  const result = await poolPublicaciones.query('SELECT * FROM publicaciones');
  res.json({ posts: result.rows });
});

// Ruta para obtener detalles de una publicación
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;

  const result = await poolPublicaciones.query('SELECT * FROM publicaciones WHERE id = $1', [id]);
  
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json({ post: result.rows[0] });
});

// Ruta para obtener categorías
app.get('/api/categories', async (req, res) => {
  const result = await poolCategorias.query('SELECT * FROM categorias');
  res.json({ categories: result.rows });
});

// Ruta para gestionar compras (ejemplo)
app.post('/api/compras', authenticateToken, async (req, res) => {
  const { usuario_id, items } = req.body;

  const compraResult = await poolCompras.query(
    'INSERT INTO compras (usuario_id) VALUES ($1) RETURNING *',
    [usuario_id]
  );

  const compra = compraResult.rows[0];

  for (const item of items) {
    await poolDetallesCompras.query(
      'INSERT INTO detalle_compras (compra_id, publicacion_id, cantidad) VALUES ($1, $2, $3)',
      [compra.id, item.publicacion_id, item.cantidad]
    );
  }

  res.json({ compra });
});

// Pruebas utilizando supertest
if (process.env.NODE_ENV === 'test') {
  describe('API tests', () => {
    it('should register a user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should login a user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should fetch user profile', async () => {
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      const token = loginResponse.body.token;

      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.user).toBeDefined();
    });

    it('should create a post', async () => {
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      const token = loginResponse.body.token;

      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Post', content: 'This is a test post.', categoryId: 1 });

      expect(postResponse.status).toBe(200);
      expect(postResponse.body.post).toBeDefined();
    });

    it('should fetch all posts', async () => {
      const response = await request(app).get('/api/posts');
      expect(response.status).toBe(200);
      expect(response.body.posts).toBeDefined();
    });

    it('should fetch post details', async () => {
      const response = await request(app).get('/api/posts/1');
      expect(response.status).toBe(200);
      expect(response.body.post).toBeDefined();
    });

    it('should fetch all categories', async () => {
      const response = await request(app).get('/api/categories');
      expect(response.status).toBe(200);
      expect(response.body.categories).toBeDefined();
    });
  });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
