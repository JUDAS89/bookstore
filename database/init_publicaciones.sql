CREATE TABLE IF NOT EXISTS publicaciones (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200),
  descripcion TEXT,
  precio DECIMAL(10, 2),
  imagen TEXT,
  categoria_id INT REFERENCES categorias(id)
);
