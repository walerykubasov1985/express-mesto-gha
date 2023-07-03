const User = require("../models/user");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require("../errors/errors");

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.log(BAD_REQUEST);
        res
          .status(BAD_REQUEST)
          .send({ message: "Данные введены некорректно", error: err });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Ошибка", error: err });
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
      res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка", error: err });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с таким ID не найден" });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: "Данные введены некорректно" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Ошибка", error: err });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с таким ID не найден" });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: "Данные введены некорректно" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Ошибка", error: err });
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
    }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с таким ID не найден" });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.log(BAD_REQUEST);
        res.status(BAD_REQUEST).send({ message: "Данные введены некорректно" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Ошибка", error: err });
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
