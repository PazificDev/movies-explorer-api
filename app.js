// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { PORT, MONGODB_URI } = require('./config');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { joiCreateUser, joiLoginUser } = require('./middlewares/validation');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(express.json());

mongoose.connect(MONGODB_URI);

app.use(requestLogger);

app.post('/signin', joiLoginUser, login);
app.post('/signup', joiCreateUser, createUser);
app.use(auth);
app.use(router);

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use(centralErrorHandler);

app.listen(PORT);
