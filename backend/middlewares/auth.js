const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');

const { JWT_SECRET } = process.env;

const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = { _id: payload._id };

  next();
};

module.exports = { checkAuth };
