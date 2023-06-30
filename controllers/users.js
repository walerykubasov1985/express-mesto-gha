const User = require("../models/user");
const http = require("http")

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "ValidationError") {
        res.send(createError(400, {message: err.message}));
      } else {
        res.send(createError(500, {message: err.message}));
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.log(http);
      res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if(!user){
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Пользователь с таким ID не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http.STATUS_CODES.BadRequest).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if(!user){
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Пользователь с таким ID не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http.STATUS_CODES.BadRequest).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if(!user){
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Пользователь с таким ID не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(http.STATUS_CODES.BadRequest).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(http.STATUS_CODES.InternalServerError).send({ message: 'Ошибка', error: err });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
