const { celebrate, Joi } = require('celebrate');

const checkLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const checkCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/http[s]?:\/\/(www\.)?[0-9a-zA-Z]+([.|-]{1}[0-9a-zA-Z]+)*\.[0-9a-zA-Z-]+(\/[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]*#?)?$/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = { checkLogin, checkCreateUser };
