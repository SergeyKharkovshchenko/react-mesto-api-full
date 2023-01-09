class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessDeniedError';
    this.statusCode = 403;
  }
}

module.exports = {
  AccessDeniedError,
};
