const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  createUserValidation,
  loginValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
  getUserValidation,
} = require('../middlewares/validation');

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный формат ID пользователя');
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      next(err);
    });
};

const updateProfileUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный формат ID пользователя');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    });
};

const updateAvatarUser = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный формат ID пользователя');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });

          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.send({ message: 'Аутентификация прошла успешно' });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById: [getUserValidation, getUserById],
  createUser: [createUserValidation, createUser],
  updateProfileUser: [updateUserProfileValidation, updateProfileUser],
  updateAvatarUser: [updateUserAvatarValidation, updateAvatarUser],
  login: [loginValidation, login],
  getCurrentUser,
};
