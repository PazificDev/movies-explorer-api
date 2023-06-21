const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const BadRequestErr = require('../errors/BadRequestErr');

const isUrlValidation = (url) => {
  if (validator.isURL(url)) {
    return url;
  }
  throw new BadRequestErr('Неверный URL');
};

const correctIdValidation = (id) => {
  const correctId = /[0-9a-fA-F]{24}/;
  if (correctId.test(id)) {
    return id;
  }
  throw new BadRequestErr('Неверный ID');
};

const joiCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const joiLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const joiPatchUserInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
});

const joiCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isUrlValidation),
    trailerLink: Joi.string().required().custom(isUrlValidation),
    thumbnail: Joi.string().required().custom(isUrlValidation),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const joiDeleteMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().custom(correctIdValidation),
  }),
});

module.exports = {
  correctIdValidation,
  isUrlValidation,
  joiCreateUser,
  joiLoginUser,
  joiPatchUserInfo,
  joiCreateMovie,
  joiDeleteMovie,
};
