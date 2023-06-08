const { celebrate, Joi } = require('celebrate');
const { urlPattern } = require('../utils/constants');

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.object(),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlPattern).required(),
  }),
});

const validateDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.object().required(),
  }),
});

const validateLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.object().required(),
  }),
});

const validateRemoveLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.object().required(),
  }),
});

module.exports = {
  validateSignIn,
  validateSignUp,
  validateUserAvatar,
  validateUpdateUser,
  validateCreateCard,
  validateDeleteCard,
  validateLikeCard,
  validateRemoveLikeCard,
  validateGetUser,
};
