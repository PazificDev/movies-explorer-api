const userRoutes = require('express').Router();
const { joiPatchUserInfo } = require('../middlewares/validation');

const {
  getUser,
  patchUserInfo,
} = require('../controllers/users');

userRoutes.get('/me', getUser);

userRoutes.patch('/me', joiPatchUserInfo, patchUserInfo);

module.exports = userRoutes;
