const { CustomError } = require('./customError.js');
const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ success: false, payload: error.message });
  }
  // todo: change this to custom error
  return res.status(500).send({ success: false, payload: error });
};

module.exports = errorHandler;
