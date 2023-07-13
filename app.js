const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralError = require('./middlewares/centralError');
const { checkLogin, checkCreateUser } = require('./middlewares/celebrates');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const { NOT_FOUND } = require('./errors/errors');

const app = express();
app.use(bodyParser.json());

app.post('/signin', checkLogin, login);
app.post('/signup', checkCreateUser, createUser);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Данный путь не найден!!!' });
});
app.use(centralError);

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    family: 4,
  })
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log('Ошибка при запуске сервера');
      } else {
        console.log(`Сервер запущен на порт: ${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error('Ошибка подключения to MongoDB:', err);
  });
