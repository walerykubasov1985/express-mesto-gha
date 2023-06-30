const User = require("../models/user");
const createError = require("http-errors");

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
    .catch(() => {
      res.send(createError(500, {message: err.message}));
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if(!user){
        res(404).send("Пользователя с таким ID не существует");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.send(createError(400, {message: err.message}));
      } else {
        res.send(createError(500, {message: err.message}));
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
