const { isValidObjectId } = require('mongoose');
const cardsModel = require('../models/card');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');

const getCards = (req, res, next) => {
  cardsModel.find({}).then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardsModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(new Error(err.message));
    });
};

// eslint-disable-next-line consistent-return
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  if (!isValidObjectId(cardId)) {
    throw new BadRequest('Переданы некорректные данные');
  }
  cardsModel.findById(cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(userId)) {
        throw new Forbidden('Вы не можете удалить данную карточку');
      }
      return cardsModel.deleteOne({ _id: cardId });
    })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        throw new Error('Серверная ошибка');
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('Карточка не найдена'));
      }
      return next(err);
    });
};

const putLikes = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(userId) || !isValidObjectId(cardId)) {
    throw new BadRequest('Переданы некорректные данные');
  }
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      return res.send(card.likes);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(userId) || !isValidObjectId(cardId)) {
    throw new BadRequest('Переданы некорректные данные');
  }

  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      return res.send(card.likes);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLike,
};
