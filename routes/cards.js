const router = require('express').Router();

const { checkCardInfo, checkCardId } = require('../middlewares/celebrates');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', checkCardInfo, createCard);
router.delete('/:id', checkCardId, deleteCard);
router.put('/:id/likes', checkCardId, addLike);
router.delete('/:id/likes', checkCardId, deleteLike);

module.exports = router;
