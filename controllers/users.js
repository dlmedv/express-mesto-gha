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
  userModel.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Пользователь с данным "_id" не найден'));
      }
      return next(err);
    });
};

const getMyUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Пользователь с данным "_id" не найден'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest('Переданы некорректные данные'));
          } else if (err.code === 11000) {
            return next(new Conflict('Пользователь с таким Email уже существует'));
          }
          return next(new Error(err.message));
        });
    })
    .catch(next);
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findOne({ email })
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

      return res.status(200).send({ token });
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
