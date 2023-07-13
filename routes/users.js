const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:me', updateUser);
router.patch('/:me/avatar', updateUserAvatar);

module.exports = router;
