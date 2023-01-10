const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { ItemNotFoundError, BadRequestError, UnauthorizedError } = require('../middlewares/errors');

const { JWT_SECRET } = process.env;

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new ItemNotFoundError('Юзера с таким айди не существует');
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ItemNotFoundError('User not found');
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcryptjs.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    return res
      .header('Access-Control-Allow-Origin: *')
      .status(201).json({
        name: user.name,
        avatar: user.avatar,
        about: user.about,
        email: user.email,
        _id: user._id,
      });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Вы пытаетесь зарегистрироваться по уже существующему в базе email' });
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      // runValidators: true,
    });
    if (!user) {
      throw new ItemNotFoundError('User not found');
    }
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new ItemNotFoundError('User avatar not found');
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const logout = async (req, res) => {
// res.clearCookie('jwt');
  res
    .header(
      'Access-Control-Allow-Origin: *',
    // 'Access-Control-Allow-Origin: sergey-kh.nomoredomains.club',
    )
    .clearCookie('jwt')
    .json({ message: 'Логаут прошел успешно' });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Неверный пользователь или пароль'));
    }
    const isLoggedIn = await bcryptjs.compare(password, user.password);
    if (!isLoggedIn) {
      return next(new UnauthorizedError('Неверный пользователь или пароль'));
    }
    const token = JWT.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res
      .header(
        'Access-Control-Allow-Origin: *',
        // 'Access-Control-Allow-Origin: sergey-kh.nomoredomains.club',
      )
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: 'true',
        secure: 'true',
        sameSite: 'none',
      })
      .json({ message: 'Авторизация прошла успешно' });
  } catch (err) {
    return next(err);
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  getUserMe,
  login,
  logout,
};
