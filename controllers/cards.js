const Card = require('../models/card');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN, } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка', error: err });
      }
    });
};

const deleteCard = (req, res) => {
  const owner = req.user._id;
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (card.owner.toString() !== owner) { return res.status(FORBIDDEN).send({ message: 'Нет прав на удаление карточки' }); }

      return Card.findByIdAndRemove(req.params.id);
    })
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка' });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка' });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
