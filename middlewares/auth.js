const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Ошибка авторизации'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret');
  } catch (err) {
    return next(new Unauthorized('Ошибка авторизации'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = auth;
