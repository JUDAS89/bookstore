import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pkg;

const ensureDatabaseExists = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    const client = await pool.connect();
    const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`;
    const dbCheckResult = await client.query(dbCheckQuery);

    if (dbCheckResult.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Base de datos ${process.env.DB_NAME} creada correctamente`);
    } else {
      console.log(`Base de datos ${process.env.DB_NAME} ya existe`);
    }

    client.release();
  } catch (error) {
    console.error('Error al verificar o crear la base de datos:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

const executeQueryWithTransaction = async (client, queries) => {
  try {
    await client.query('BEGIN');
    for (let query of queries) {
      await client.query(query + ';');
      console.log(`Ejecutado con éxito: ${query}`);
    }
    await client.query('COMMIT');
    console.log('Transacción completada con éxito.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error durante la transacción, todos los cambios se deshicieron:', error);
    throw error;
  }
};

const insertLibrosFromJSON = async (client) => {
  const libros = JSON.parse(fs.readFileSync(path.join(__dirname, '../../frontend/public/libros.json'), 'utf8'));

  for (const libro of libros) {
    const categoriaResult = await client.query('SELECT id FROM categorias WHERE nombre = $1', [libro.categoria]);
    let categoria_id;
    
    if (categoriaResult.rowCount === 0) {
      const newCategoriaResult = await client.query(
        'INSERT INTO categorias (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING RETURNING id',
        [libro.categoria]
      );
      categoria_id = newCategoriaResult.rows[0].id;
    } else {
      categoria_id = categoriaResult.rows[0].id;
    }
    

    const libroResult = await client.query('SELECT id FROM publicaciones WHERE id = $1', [libro.id]);

    if (libroResult.rowCount === 0) {
      await client.query(
        'INSERT INTO publicaciones (id, titulo, precio, categoria_id, ventas) VALUES ($1, $2, $3, $4, $5)',
        [libro.id, libro.titulo, libro.price, categoria_id, 0]
      );
      console.log(`Libro "${libro.titulo}" insertado correctamente.`);
    } else {
      console.log(`Libro "${libro.titulo}" ya existe en la base de datos.`);
    }
  }
};

const setupDatabase = async () => {
  await ensureDatabaseExists();

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    const client = await pool.connect();

    const categoriasSql = fs.readFileSync(path.join(__dirname, 'init_categorias.sql')).toString();
    const usuariosSql = fs.readFileSync(path.join(__dirname, 'init_usuarios.sql')).toString();
    const publicacionesSql = fs.readFileSync(path.join(__dirname, 'init_publicaciones.sql')).toString();
    const comprasSql = fs.readFileSync(path.join(__dirname, 'init_compras.sql')).toString();
    const detallesComprasSql = fs.readFileSync(path.join(__dirname, 'init_detalles_compras.sql')).toString();
    const ratingsSql = fs.readFileSync(path.join(__dirname, 'init_ratings.sql')).toString(); 

    await executeQueryWithTransaction(client, [
      categoriasSql,
      usuariosSql,
      publicacionesSql,
      comprasSql,
      detallesComprasSql,
      ratingsSql,  // Agrega esto
    ]);

    await insertLibrosFromJSON(client);

    client.release();
    console.log('Todas las tablas y datos iniciales fueron configurados correctamente.');

    return pool;
  } catch (error) {
    console.error('Error al configurar las tablas:', error);
    throw error;
  }
};

export { setupDatabase };

