import jwt from 'jsonwebtoken';

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      console.log('Decoded user:', user); // Tambahkan log ini
      req.user = user; // Pastikan userId ada di sini
      next();
    });
  } else {
    res.status(401).json({ message: 'Token not provided' });
  }
};

export { authJWT };