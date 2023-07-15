const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());

app.use('/users', createUserValidation, limiter);
app.use('/cards', limiter);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(authMiddleware);

app.use((req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');
  next(error);
});

app.use(errorMiddleware);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаемый порт: ${PORT}`);
});
