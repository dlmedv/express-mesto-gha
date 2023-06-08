const router = require('express').Router();
const cardsController = require('../controllers/cards');
const {
  validateCreateCard,
  validateDeleteCard,
  validateLikeCard,
  validateRemoveLikeCard,
} = require('../middlewares/validations');

router.get('/cards', cardsController.getCards);
router.post('/cards', validateCreateCard, cardsController.createCard);
router.delete('/cards/:cardId', validateDeleteCard, cardsController.deleteCard);
router.put('/cards/:cardId/likes', validateLikeCard, cardsController.putLikes);
router.delete('/cards/:cardId/likes', validateRemoveLikeCard, cardsController.deleteLike);

module.exports = router;
