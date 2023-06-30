const Card = require("../models/card");
const createError = require("http-errors");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.send(createError(500, { message: err.message }));
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
        res.send(createError(400, { message: err.message }));
      } else {
        res.send(createError(500, { message: err.message }));
      }
    });
};

const deleteCard = (req, res) => {
  console.log(req.params);
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.send(createError(404, "Карточки не существует"));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.send(createError(400, { message: err.message }));
      } else {
        res.send(createError(500, { message: err.message }));
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
        res.send(createError(404, "Карточки не существует"));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.send(createError(400, { message: err.message }));
      } else {
        res.send(createError(500, { message: err.message }));
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
        res.send(createError(404, "Карточки не существует"));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.send(createError(400, { message: err.message }));
      } else {
        res.send(createError(500, { message: err.message }));
      }
    });
};

module.exports = { getCards, createCard, deleteCard, addLike, deleteLike };
