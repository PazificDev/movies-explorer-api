const movieRoutes = require('express').Router();
const { joiCreateMovie, joiDeleteMovie } = require('../middlewares/validation');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRoutes.get('/', getMovies);

movieRoutes.post('/', joiCreateMovie, createMovie);

movieRoutes.delete('/:_id', joiDeleteMovie, deleteMovie);

module.exports = movieRoutes;
