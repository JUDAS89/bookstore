CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE
);

-- Insertar categorías basadas en libros.json
INSERT INTO categorias (nombre) VALUES 
('Literatura y ficción'),
('Biografías y Memorias'),
('Misterio, Thriller y Suspenso'),
('Ficción Literaria'),
('Ficción de Acción y Aventura'),
('Acción y Aventura Clásica'),
('Ficción Erótica'),
('Mitología y Cuentos Populares'),
('Biografías de Presidentes y Jefes de Estado'),
('Thriller Psicológicos');
