/* eslint-disable no-else-return */
const Movie = require('../models/movie');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getMovies = (req, res, next) => {
  const currentUserId = req.user._id;

  Movie.find({ owner: currentUserId })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы неверные данные'));
      } else {
        return next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params._id)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundErr('Фильм не найден'));
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenErr('Недостаточно прав для удаления'));
      }
      return movie.deleteOne().then(() => {
        res.status(200).send({ message: 'Фильм удален' });
      });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
