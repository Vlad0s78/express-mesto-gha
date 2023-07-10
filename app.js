const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { ERROR_CODE } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64a9cc86983b13aaaa6160da',
  };
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/users', limiter);
app.use('/cards', limiter);

app.use(helmet());

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req, res) => {
  res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаемый порт: ${PORT}`);
});
