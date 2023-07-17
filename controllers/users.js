/* eslint-disable no-else-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mongoose } = require('mongoose');
const User = require('../models/user');
const BadRequestErr = require('../errors/BadRequestErr');
const AlreadyExistErr = require('../errors/AlreadyExistErr');
const NotFoundErr = require('../errors/NotFoundErr');
const { secretKey } = require('../config');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then(() => res.status(201).send(
          {
            data: {
              email,
              name,
            },
          },
        ))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new AlreadyExistErr('Пользователь с данным email уже существует'));
          } else if (err.name === 'ValidationError') {
            return next(new BadRequestErr('Переданы неверные данные'));
          } else {
            return next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundErr('Пользователь не найден'));
      } else {
        return next(err);
      }
    });
};

const patchUserInfo = (req, res, next) => {
  const {
    email,
    name,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы неверные данные'));
      } else if (err.code === 11000) {
        return next(new AlreadyExistErr('Пользователь с данным email уже существует'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundErr('Пользователь не найден'));
      } else {
        return next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUser,
  patchUserInfo,
};
