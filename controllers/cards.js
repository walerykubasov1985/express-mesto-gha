const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");
const ValidationError = require("../errors/ValidationError");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      new InternalServerError("Произошла ошибка");
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
    .catch(() => {
      if (error.name === "ValidationError") {
        new ValidationError("Некорректные данные при создании карточки.");
      } else {
        new InternalServerError("Произошла ошибка");
      }
    });
};

const deleteCard = (req, res) => {
  console.log(req.params);
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        new NotFoundError('карточка не существует');
        return;
      }
      res.send(card);
    })
    .catch(() => {
      if (error.name === 'ValidationError') {
        new ValidationError('Некорректные данные');
      } else {
        new InternalServerError('Произошла ошибка');
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
        new NotFoundError('карточка не существует');
        return;
      }
      res.send(card)})
    .catch(() => {
      if (error.name === 'ValidationError') {
        new ValidationError('Некорректные данные');
      } else {
        new InternalServerError('Произошла ошибка');
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
        new NotFoundError('карточка не существует');
        return;
      }
      res.send(card)})
    .catch(() => {
      if (error.name === 'ValidationError') {
        new ValidationError('Некорректные данные');
      } else {
        new InternalServerError('Произошла ошибка');
      }
    });
};

module.exports = { getCards, createCard, deleteCard, addLike, deleteLike };
