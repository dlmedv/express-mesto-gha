const { celebrate, Joi } = require('celebrate');

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/i),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/i),
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
    link: Joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/i).required(),
  }),
});

const validateDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
});

const validateLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
});

const validateRemoveLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
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
  validationUserId,
};
