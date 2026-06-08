const ApiResponse = require('../utils/ApiResponse');

const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req.body);
    if (errors.length > 0) {
      return ApiResponse.badRequest(res, 'Validation failed', errors);
    }
    next();
  };
};

module.exports = validate;
