const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const {
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/validation');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(deletedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный формат ID карточки');
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный формат ID карточки');
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный формат ID карточки');
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard: [createCardValidation, createCard],
  deleteCard: [cardIdValidation, deleteCard],
  likeCard: [cardIdValidation, likeCard],
  dislikeCard: [cardIdValidation, dislikeCard],
};
