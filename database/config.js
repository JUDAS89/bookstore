import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const executeQuery = async (client, query) => {
  try {
    await client.query(query);
    console.log(`Ejecutado con éxito: ${query}`);
  } catch (error) {
    console.error(`Error ejecutando la query: ${query}`);
    throw error;
  }
};

const setupDatabase = async (user, host, database, password, port, initFile) => {
  const initialPool = new Pool({
    user,
    host,
    database: 'postgres',
    password,
    port,
  });

  try {
    const client = await initialPool.connect();

    const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = '${database}'`;
    const dbCheckResult = await client.query(dbCheckQuery);

    if (dbCheckResult.rowCount === 0) {
      await client.query(`CREATE DATABASE ${database}`);
      console.log(`Base de datos ${database} creada correctamente`);
    } else {
      console.log(`Base de datos ${database} ya existe`);
    }

    client.release();

    const specificDbPool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });

    const specificDbClient = await specificDbPool.connect();

    const initSql = fs.readFileSync(path.join(__dirname, initFile)).toString();
    const queries = initSql.split(';').filter(query => query.trim());

    for (let query of queries) {
      await executeQuery(specificDbClient, query + ';');
    }

    console.log(`Tablas y datos iniciales configurados correctamente en ${database}`);
    specificDbClient.release();

    return specificDbPool;
  } catch (error) {
    console.error(`Error al configurar la base de datos ${database}:`, error);
  } finally {
    await initialPool.end();
  }
};

const categoriasPool = await setupDatabase(
  process.env.DB_USER_CATEGORIAS,
  process.env.DB_HOST_CATEGORIAS,
  process.env.DB_NAME_CATEGORIAS,
  process.env.DB_PASSWORD_CATEGORIAS,
  process.env.DB_PORT_CATEGORIAS,
  'init_categorias.sql'
);

const usuariosPool = await setupDatabase(
  process.env.DB_USER_USUARIOS,
  process.env.DB_HOST_USUARIOS,
  process.env.DB_NAME_USUARIOS,
  process.env.DB_PASSWORD_USUARIOS,
  process.env.DB_PORT_USUARIOS,
  'init_usuarios.sql'
);

const publicacionesPool = await setupDatabase(
  process.env.DB_USER_PUBLICACIONES,
  process.env.DB_HOST_PUBLICACIONES,
  process.env.DB_NAME_PUBLICACIONES,
  process.env.DB_PASSWORD_PUBLICACIONES,
  process.env.DB_PORT_PUBLICACIONES,
  'init_publicaciones.sql'
);

const comprasPool = await setupDatabase(
  process.env.DB_USER_COMPRAS,
  process.env.DB_HOST_COMPRAS,
  process.env.DB_NAME_COMPRAS,
  process.env.DB_PASSWORD_COMPRAS,
  process.env.DB_PORT_COMPRAS,
  'init_compras.sql'
);

const detallesComprasPool = await setupDatabase(
  process.env.DB_USER_DETALLES_COMPRAS,
  process.env.DB_HOST_DETALLES_COMPRAS,
  process.env.DB_NAME_DETALLES_COMPRAS,
  process.env.DB_PASSWORD_DETALLES_COMPRAS,
  process.env.DB_PORT_DETALLES_COMPRAS,
  'init_detalles_compras.sql'
);

export {
  usuariosPool,
  categoriasPool,
  publicacionesPool,
  comprasPool,
  detallesComprasPool,
};





