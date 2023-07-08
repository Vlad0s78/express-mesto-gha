const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use(userRoutes);
app.use(cardRoutes);

app.use((req, res, next) => {
  req.user = {
    _id: '64a9cc86983b13aaaa6160da',
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`'Слушаемый порт:'${PORT}`);
});
