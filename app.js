const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
require('dotenv').config();

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  family: 4,
});

const app = express();
const centralError = require('./middlewares/centralError');
const routes = require('./routes');

app.use(helmet());
app.use(bodyParser.json());

app.use(routes);
app.use(errors());
app.use(centralError);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Ошибка при запуске сервера');
  } else {
    console.log(`Сервер запущен на порт: ${PORT}`);
  }
});
