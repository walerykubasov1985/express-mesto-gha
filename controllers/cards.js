const Card = require("../models/card");
const http = require("http");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http.STATUS_CODES.BadRequest).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
      }
    });
};

const deleteCard = (req, res) => {
  console.log(req.params);
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http.STATUS_CODES.BadRequest).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http.STATUS_CODES.BadRequest).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http.STATUS_CODES.BadRequest).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
      }
    });
};

module.exports = { getCards, createCard, deleteCard, addLike, deleteLike };
