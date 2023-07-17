const jwt = require('jsonwebtoken');
const NotAuthorized = require('../errors/notAuthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAuthorized('Нужно авторизоваться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new NotAuthorized('Нужно авторизоваться'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
