const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data, errorMessages) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = errorMessages.invalid_email;
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = errorMessages.email_field_required;
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = errorMessages.password_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
