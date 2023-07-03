const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "649b21cfe7a0a1f4c666e58e", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    family: 4,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порт: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Ошибка подключения to MongoDB:", err);
  });
