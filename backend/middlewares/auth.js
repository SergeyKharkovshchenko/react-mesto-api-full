const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    // payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = { _id: payload._id };

  next();
};

module.exports = { checkAuth };
