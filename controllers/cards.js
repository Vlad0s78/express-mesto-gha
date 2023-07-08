const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка', error: err });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    // eslint-disable-next-line consistent-return
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send(deletedCard);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Некорректный формат ID карточки' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send(updatedCard);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Некорректный формат ID карточки' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send(updatedCard);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Некорректный формат ID карточки' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
