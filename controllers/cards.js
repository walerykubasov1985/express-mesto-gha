const Card = require("../models/card");
const {BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND} = require("../errors/errors");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка', error: err });
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
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно',  error: err });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка', error: err });
      }
    });
};

const deleteCard = (req, res) => {
  console.log(req.params);
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка', error: err });
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
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка', error: err });
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
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка', error: err });
      }
    });
};

module.exports = { getCards, createCard, deleteCard, addLike, deleteLike };
