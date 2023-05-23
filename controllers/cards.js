const cardsModel = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

const getCards = (req, res) => {
  cardsModel.find({}).then((cards) => res.send(cards))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardsModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const deleteCard = (req, res) => {
  cardsModel.findByIdAndRemove(req.params.cardId).then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const putLikes = (req, res) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const deleteLike = (req, res) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLike,
};
