const User = require('../models/user');
const { ERROR_CODE } = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка', error: err });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Некорректный формат ID пользователя' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfileUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.send(updatedUser);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Некорректный формат ID пользователя' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка', error: err });
    });
};

const updateAvatarUser = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.send(updatedUser);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Некорректный формат ID пользователя' });
      }
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка', error: err });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileUser,
  updateAvatarUser,
};
