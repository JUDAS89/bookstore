import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para configurar una base de datos específica
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

    // Verificar si la base de datos existe
    const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = '${database}'`;
    const dbCheckResult = await client.query(dbCheckQuery);

    if (dbCheckResult.rowCount === 0) {
      // Crear la base de datos si no existe
      await client.query(`CREATE DATABASE ${database}`);
      console.log(`Base de datos ${database} creada correctamente`);
    } else {
      console.log(`Base de datos ${database} ya existe`);
    }

    client.release();

    // Conexión a la base de datos específica para crear las tablas y datos iniciales
    const specificDbPool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });

    const specificDbClient = await specificDbPool.connect();

    // Leer el script SQL correspondiente
    const initSql = fs.readFileSync(path.join(__dirname, initFile)).toString();

    // Ejecutar el script SQL para crear las tablas y datos iniciales
    await specificDbClient.query(initSql);

    console.log(`Tablas y datos iniciales configurados correctamente en ${database}`);
    specificDbClient.release();
  } catch (error) {
    console.error(`Error al configurar la base de datos ${database}:`, error);
  } finally {
    await initialPool.end();
  }
};

// Configuración de todas las bases de datos
const setupAllDatabases = async () => {
  await setupDatabase(process.env.DB_USER_USUARIOS, process.env.DB_HOST_USUARIOS, process.env.DB_NAME_USUARIOS, process.env.DB_PASSWORD_USUARIOS, process.env.DB_PORT_USUARIOS, 'init_usuarios.sql');
  await setupDatabase(process.env.DB_USER_CATEGORIAS, process.env.DB_HOST_CATEGORIAS, process.env.DB_NAME_CATEGORIAS, process.env.DB_PASSWORD_CATEGORIAS, process.env.DB_PORT_CATEGORIAS, 'init_categorias.sql');
  await setupDatabase(process.env.DB_USER_PUBLICACIONES, process.env.DB_HOST_PUBLICACIONES, process.env.DB_NAME_PUBLICACIONES, process.env.DB_PASSWORD_PUBLICACIONES, process.env.DB_PORT_PUBLICACIONES, 'init_publicaciones.sql');
  await setupDatabase(process.env.DB_USER_COMPRAS, process.env.DB_HOST_COMPRAS, process.env.DB_NAME_COMPRAS, process.env.DB_PASSWORD_COMPRAS, process.env.DB_PORT_COMPRAS, 'init_compras.sql');
  await setupDatabase(process.env.DB_USER_DETALLES_COMPRAS, process.env.DB_HOST_DETALLES_COMPRAS, process.env.DB_NAME_DETALLES_COMPRAS, process.env.DB_PASSWORD_DETALLES_COMPRAS, process.env.DB_PORT_DETALLES_COMPRAS, 'init_detalles_compras.sql');
};

setupAllDatabases();

export {
  usuariosPool,
  categoriasPool,
  publicacionesPool,
  comprasPool,
  detallesComprasPool,
};

