const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/https{0,1}:\/\/.*/),
  }),
}), createCard);
router.delete('/:cardId', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).required().hex() }) }), deleteCardById);
router.put('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).required().hex() }) }), likeCard);
router.delete('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).required().hex() }) }), dislikeCard);

module.exports = router;
