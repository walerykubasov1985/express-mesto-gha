const centralError = (err, req, res, next) => {
  const { status = 500, message = 'На сервере произошла ошибка' } = err;
  res.status(status).send({ message });
  next();
};

module.exports = centralError;
