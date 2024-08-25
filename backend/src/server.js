import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as loggerExpress from 'logger-express';
import { nanoid } from 'nanoid';
import request from 'supertest';
import { setupDatabase } from '../database/config.js'; 
import { authenticateToken } from './middlewares.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Implementar CORS
app.use(express.json());
app.use(morgan('dev'));
app.use(loggerExpress.logger());


// Configurar la base de datos y luego iniciar el servidor
setupDatabase().then(pool => {
  
  app.locals.db = pool; // Se puede almacenar la conexión en app.locals para acceder en las rutas

 // Ruta para registrar usuarios
app.post('/api/users/register', async (req, res) => {
  const { email, password } = req.body;

  // Validación de entrada
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await app.locals.db.query(
      'INSERT INTO usuarios (correo, contraseña) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.correo }, process.env.JWT_SECRET);
    
    res.json({ token, user });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

 // Ruta para iniciar sesión
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await app.locals.db.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.contraseña);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: user.id, email: user.correo }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor. Inténtalo más tarde.' });
  }
});

  // Ruta para obtener el perfil del usuario
  app.get('/api/users/profile', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    const result = await app.locals.db.query('SELECT id, correo FROM usuarios WHERE id = $1', [userId]);
    
    res.json({ user: result.rows[0] });
  });

  // Ruta para crear publicaciones
  app.post('/api/posts', authenticateToken, async (req, res) => {
    const { title, content, categoryId } = req.body;
    
    const result = await app.locals.db.query(
      'INSERT INTO publicaciones (titulo, descripcion, categoria_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, categoryId]
    );

    res.json({ post: result.rows[0] });
  });

  // Ruta para obtener publicaciones
  app.get('/api/posts', async (req, res) => {
    const result = await app.locals.db.query('SELECT * FROM publicaciones');
    res.json({ posts: result.rows });
  });

  // Ruta para obtener detalles de una publicación
  app.get('/api/posts/:id', async (req, res) => {
    const { id } = req.params;

    const result = await app.locals.db.query('SELECT * FROM publicaciones WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post: result.rows[0] });
  });

  // Ruta para obtener categorías
  app.get('/api/categories', async (req, res) => {
    const result = await app.locals.db.query('SELECT * FROM categorias');
    res.json({ categories: result.rows });
  });

  // Ruta para gestionar compras (ejemplo)
  app.post('/api/compras', authenticateToken, async (req, res) => {
    const { usuario_id, items } = req.body;

    const compraResult = await app.locals.db.query(
      'INSERT INTO compras (usuario_id) VALUES ($1) RETURNING *',
      [usuario_id]
    );

    const compra = compraResult.rows[0];

    for (const item of items) {
      await app.locals.db.query(
        'INSERT INTO detalle_compras (compra_id, publicacion_id, cantidad) VALUES ($1, $2, $3)',
        [compra.id, item.publicacion_id, item.cantidad]
      );
    }

    res.json({ compra });
  });

  // Iniciar el servidor después de configurar la base de datos
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  
}).catch(error => {
  console.error('Error al configurar la base de datos:', error);
});

