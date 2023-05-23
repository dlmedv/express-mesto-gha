const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/users', usersController.getUsers);
router.get('/users/:userId', usersController.getUserById);
router.post('/users', usersController.createUser);
router.patch('/users/me', usersController.updateUser);
router.patch('/users/me/avatar', usersController.updateAvatar);
router.use('*', (req, res) => res.status(404).send({
  message: 'По этому адресу ничего нет',
}));

module.exports = router;
