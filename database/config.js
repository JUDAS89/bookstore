import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDatabaseExists = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Conéctate a la base de datos por defecto "postgres"
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
    await client.query('BEGIN'); // Inicia la transacción, esto arroja vía terminal los comandos del sql
    for (let query of queries) {
      await client.query(query + ';');
      console.log(`Ejecutado con éxito: ${query}`);
    }
    await client.query('COMMIT'); // Confirma la transacción si todo va bien
    console.log('Transacción completada con éxito.');
  } catch (error) {
    await client.query('ROLLBACK'); // Deshace todos los cambios si ocurre un error
    console.error('Error durante la transacción, todos los cambios se deshicieron:', error);
    throw error;
  }
};

const setupDatabase = async () => {
  await ensureDatabaseExists(); // Asegúrate de que la base de datos existe antes de configurar las tablas

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, // Conéctate a la base de datos que acabas de crear
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

    await executeQueryWithTransaction(client, [
      categoriasSql,
      usuariosSql,
      publicacionesSql,
      comprasSql,
      detallesComprasSql,
    ]);

    client.release();
    console.log('Todas las tablas y datos iniciales fueron configurados correctamente.');

    return pool; // Retorna el pool para que pueda ser usado en server.js
  } catch (error) {
    console.error('Error al configurar las tablas:', error);
    throw error; 
  }
  // No cierres el pool aquí, ya que lo necesitamos para consultas futuras 
};


export { setupDatabase };