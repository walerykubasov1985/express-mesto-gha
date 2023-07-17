const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();
const centralError = require('./middlewares/centralError');
const routes = require('./routes');

app.use(bodyParser.json());

app.use(routes);
app.use(errors());
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
