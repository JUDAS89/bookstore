import jwt from 'jsonwebtoken';

// Middleware para validar token JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

    // Depuración: Mostrar el token recibido en el servidor
    console.log('Token recibido en el servidor:', token);

  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401); // Si no hay token, responder con 401 (No autorizado)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.sendStatus(403); // Si el token es inválido, responder con 403 (Prohibido)
    }
    console.log('Token verified successfully:', user);
    req.user = user; // Asignar el usuario decodificado a req.user
    next();
  });
};
