const router = require('express').Router();

const moviesRouter = require('./movies');
const usersRouter = require('./users');

const NotFoundErr = require('../errors/NotFoundErr');

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use((req, res, next) => {
  next(new NotFoundErr('Страница не найдена'));
});

module.exports = router;
