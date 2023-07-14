const Card = require('../models/card');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) { throw new NotFound('Карточка не найдена.'); }
      if (card.owner.toString() !== owner) { throw new Forbidden('Нет прав на удаление карточки'); }
      return Card.findByIdAndRemove(req.params.id);
    })
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.message === 'InvalidCardId') {
        next(new NotFound('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
      } else {
        next(err);
      }
    });
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
      } else {
        next(err);
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
