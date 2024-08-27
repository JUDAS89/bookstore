CREATE TABLE IF NOT EXISTS publicaciones (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200),
  precio DECIMAL(10, 2),
  categoria_id INT REFERENCES categorias(id),
  ventas INT DEFAULT 0  -- Nuevo campo para registrar cuántas veces se ha vendido el libro
);

