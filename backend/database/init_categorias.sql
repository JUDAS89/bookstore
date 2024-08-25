CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

-- Insertar categorías predefinidas
INSERT INTO categorias (nombre) VALUES 
('Category 1'),
('Category 2'),
('Category 3');
