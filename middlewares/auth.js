const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Требуется аутентификация');
  }

  try {
    const payload = jwt.verify(token, 'secret-key');
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError('Неверный токен аутентификации');
  }
};

module.exports = authMiddleware;
