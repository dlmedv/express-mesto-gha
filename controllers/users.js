const { isValidObjectId } = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');
const BadRequest = require('../errors/BadRequest');

const jwtAuth = require('../utils/jwtAuth');

const getUsers = (req, res, next) => {
  userModel.find({}).then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new BadRequest('Переданы некорректные данные');
  }

  userModel.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getMyUser = (req, res, next) => {
  let userId;

  if (req.params.id) {
    userId = req.params.id;
  } else {
    userId = req.user._id;
  }

  if (!isValidObjectId(userId)) {
    throw new BadRequest('Переданы некорректные данные');
  }

  userModel.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('Пользователь с данным "_id" не найден'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    userModel.create({
      name, about, avatar, email, password: hash,
    }).then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Переданы некорректные данные'));
        } if (err.code === 11000) {
          return next(new Conflict('Пользователь с таким Email уже существует'));
        }
        return next(new Error(err.message));
      });
  });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).orFail()
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Почта или пароль введены неверно');
      }
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    // eslint-disable-next-line consistent-return
    .then(([user, matched]) => {
      if (!matched) {
        throw new Unauthorized('Почта или пароль введены неверно');
      }

      const token = jwtAuth.signToken({ _id: user._id });

      res.status(200).send({ token });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((avatarUser) => res.send(avatarUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(new Error(err.message));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  userModel.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(new Error(err.message));
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateUser,
  loginUser,
  getMyUser,
};
