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
  const { nombre, apellido, email, password } = req.body;

  // Validación de entrada
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
     // Verificar si el correo ya existe
     console.log('Verificando si el correo ya existe en la base de datos...');
     const emailCheck = await app.locals.db.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
     
     if (emailCheck.rowCount > 0) {
       // Si el correo ya existe, enviar un mensaje de error claro
       console.log(`Email ya registrado: ${email}`);
       return res.status(400).json({ error: 'Error al registrarse. Correo ya existe' });
     }
    
    console.log('Email no encontrado, procediendo a registrar el usuario...');
     // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
     // Inserción en la base de datos
     console.log('Datos recibidos para registrar:', { nombre, apellido, email, password });
     const result = await app.locals.db.query(
      `INSERT INTO usuarios (nombre, apellido, correo, contraseña) 
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, correo`,
       [nombre || '', apellido || '', email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.correo }, process.env.JWT_SECRET);
    
    console.log('Usuario registrado exitosamente:', user);
    res.json({ token, user });
  } catch (error) {
    console.error('Error al registrar usuario:', error);  // Log detallado del error
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
  
    try {
       // Modificamos la consulta SQL para seleccionar nombre, apellido y correo
      const result = await app.locals.db.query(
        'SELECT id, nombre, apellido, correo FROM usuarios WHERE id = $1', 
        [userId]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Añadimos encabezados para evitar el almacenamiento en caché de la respuesta
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      console.log('Datos del usuario obtenidos:', result.rows[0]); // Log para depuración
      res.json({ user: result.rows[0] });
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
    }
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

  // Ruta para gestionar compras
app.post('/api/compras', authenticateToken, async (req, res) => {
  const { usuario_id, items } = req.body;

  try {
    // Insertar la compra en la tabla compras
    const compraResult = await app.locals.db.query(
      'INSERT INTO compras (usuario_id) VALUES ($1) RETURNING *',
      [usuario_id]
    );

    const compra = compraResult.rows[0];

    for (const item of items) {
      // Insertar cada ítem en la tabla detalle_compras
      await app.locals.db.query(
        'INSERT INTO detalle_compras (compra_id, publicacion_id, cantidad) VALUES ($1, $2, $3)',
        [compra.id, item.publicacion_id, item.cantidad]
      );

      // Actualizar la cantidad de ventas en la tabla publicaciones
      await app.locals.db.query(
        'UPDATE publicaciones SET ventas = ventas + $1 WHERE id = $2',
        [item.cantidad, item.publicacion_id]
      );
    }

    res.json({ compra });
  } catch (error) {
    console.error('Error al realizar la compra:', error);
    res.status(500).json({ error: 'Error al procesar la compra.' });
  }
});

// Ruta para obtener las compras del usuario
app.get('/api/users/compras', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await app.locals.db.query(
      `SELECT 
          co.id AS compra_id,  
          p.id AS publicacion_id,  
          p.titulo, 
          p.precio, 
          p.ventas, 
          c.nombre AS categoria, 
          dc.cantidad, 
          co.fecha, 
          r.rating AS userRating  -- Obtenemos el rating si existe
       FROM 
          detalle_compras dc 
       JOIN 
          publicaciones p ON dc.publicacion_id = p.id 
       JOIN 
          compras co ON dc.compra_id = co.id 
       JOIN 
          categorias c ON p.categoria_id = c.id 
       LEFT JOIN 
          ratings r ON r.publicacion_id = p.id AND r.usuario_id = $1  -- Verificamos si el usuario ha votado
       WHERE 
          co.usuario_id = $1`,
      [userId]
    );

    res.json({ compras: result.rows });
  } catch (error) {
    console.error('Error al obtener las compras del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las compras del usuario' });
  }
});


// Ruta para enviar un rating
app.post('/api/ratings', authenticateToken, async (req, res) => {
  const { publicacion_id, rating } = req.body;
  const usuario_id = req.user.id;

  try {
    // Verificar si el usuario ya ha calificado este libro
    const existingRating = await app.locals.db.query(
      'SELECT * FROM ratings WHERE usuario_id = $1 AND publicacion_id = $2',
      [usuario_id, publicacion_id]
    );

    if (existingRating.rowCount > 0) {
      // Si ya existe, actualizar el rating
      await app.locals.db.query(
        'UPDATE ratings SET rating = $1 WHERE usuario_id = $2 AND publicacion_id = $3',
        [rating, usuario_id, publicacion_id]
      );
    } else {
      // Si no existe, insertar el nuevo rating
      await app.locals.db.query(
        'INSERT INTO ratings (usuario_id, publicacion_id, rating) VALUES ($1, $2, $3)',
        [usuario_id, publicacion_id, rating]
      );
    }

    res.json({ message: 'Rating guardado correctamente.' });
  } catch (error) {
    console.error('Error al guardar el rating:', error.message || error);
    res.status(500).json({ error: 'Error al guardar el rating. Por favor, inténtalo nuevamente.' });
  }
});




  // Iniciar el servidor después de configurar la base de datos
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  
}).catch(error => {
  console.error('Error al configurar la base de datos:', error);
});

