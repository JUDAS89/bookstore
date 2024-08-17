CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  correo VARCHAR(100) UNIQUE,
  contraseña VARCHAR(100)
);
