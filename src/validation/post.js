const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data, errorMessages) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 6, max: 300 })) {
    errors.text = errorMessages.post_invalid_length;
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = errorMessages.text_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
