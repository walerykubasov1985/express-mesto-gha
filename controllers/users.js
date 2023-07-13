const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
} = require('../errors/errors');

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) return res.status(BAD_REQUEST).send({ message: 'Email или пароль не должны быть пустыми' });
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {res.status(CONFLICT).send({ message: 'Пользователь уже существует' });
      } else if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Данные введены некорректно' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с таким ID не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с таким ID не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с таким ID не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка' });
      }
    });
};

module.exports = {
  login,
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
