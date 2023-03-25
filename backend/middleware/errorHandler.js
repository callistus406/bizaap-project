const { CustomAPIError } = require('./customError');
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ status: false, payload: err.message });
  }
  return res.status(500).json({ payload: err.message });
};

module.exports = errorHandlerMiddleware;
