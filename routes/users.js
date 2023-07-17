const router = require('express').Router();

const { checkId, checkUpdateUser, checkAvatar } = require('../middlewares/celebrates');

const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:id', checkId, getUser);
router.patch('/:me', checkUpdateUser, updateUser);
router.patch('/:me/avatar', checkAvatar, updateUserAvatar);

module.exports = router;
