const userModel = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

const getUsers = (req, res) => {
  userModel.find({}).then((users) => res.send(users))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId).then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar }).then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((avatarUser) => res.send({ data: avatarUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  userModel.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateUser,
};
