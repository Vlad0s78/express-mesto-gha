const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Требуется аутентификация'));
  }

  try {
    const payload = jwt.verify(token, 'secret-key');
    req.user = payload;
    next();
  } catch (error) {
    return next(new UnauthorizedError('Неверный токен аутентификации'));
  }
};

module.exports = authMiddleware;
