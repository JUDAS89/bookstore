CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    publicacion_id INT REFERENCES publicaciones(id),
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5)
);


