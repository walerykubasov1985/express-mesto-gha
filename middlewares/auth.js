const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../errors/errors');

const handleAuthError = (res) => {
  res
    .status(UNAUTHORIZED)
    .send({ message: 'Необходима авторизация' });
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};

module.exports = auth;
