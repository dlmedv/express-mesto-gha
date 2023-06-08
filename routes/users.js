const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateUserAvatar, validateUpdateUser, validateGetUser } = require('../middlewares/validations');

router.get('/users', usersController.getUsers);
router.get('/users/me', validateGetUser, usersController.getMyUser);
router.get('/users/:userId', usersController.getUserById);
router.patch('/users/me', validateUpdateUser, usersController.updateUser);
router.patch('/users/me/avatar', validateUserAvatar, usersController.updateAvatar);

module.exports = router;
