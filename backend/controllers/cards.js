const Card = require('../models/card');
const { ItemNotFoundError, BadRequestError, AccessDeniedError } = require('../middlewares/errors');

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new ItemNotFoundError('Card not found');
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new ItemNotFoundError('Card not found');
    }
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const cardCheck = await Card.findById(req.params.cardId);
    if (!cardCheck) {
      throw new ItemNotFoundError('Card not found');
    }
    // eslint-disable-next-line eqeqeq
    if (cardCheck.owner != req.user._id) {
      throw new AccessDeniedError('Только владелец может удалить карточку');
    }
    const card = await Card.findByIdAndRemove(req.params.cardId);
    return res.json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCardById,
};
