const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");
const ValidationError = require("../errors/ValidationError");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        new ValidationError('Некорректные данные при создании пользователя.');
      } else {
        new InternalServerError('Произошла ошибка');
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      new InternalServerError('Произошла ошибка');
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      console.log(user);
      if (!user) {
        new NotFoundError('Пользвателя с данным ID не существует');
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        new ValidationError('Некорректные данные');
      } else {
        new InternalServerError('Произошла ошибка');
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!user) {
        new NotFoundError('Пользвателя с данным ID не существует');
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        new ValidationError('Некорректные данные пользователя');
      } else {
        new InternalServerError('Произошла ошибка');
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!user) {
        new NotFoundError('Пользвателя с данным ID не существует');
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        new ValidationError('Некорректные данные аватара');
      } else {
        new InternalServerError('Произошла ошибка');
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
