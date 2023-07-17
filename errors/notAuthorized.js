const { ERROR_AUTH } = require('./errors');

class NotAuthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_AUTH;
  }
}

module.exports = NotAuthorized;
