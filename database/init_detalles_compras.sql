CREATE TABLE IF NOT EXISTS detalle_compras (
  id SERIAL PRIMARY KEY,
  compra_id INT REFERENCES compras(id),
  publicacion_id INT REFERENCES publicaciones(id),
  cantidad INT
);
