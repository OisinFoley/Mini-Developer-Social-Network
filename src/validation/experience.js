const Validator = require('validator');
const isEmpty = require('./is-empty');
const errorMessages = require('../error-handling/strings');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = errorMessages.title_field_required;
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = errorMessages.company_field_required;
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = errorMessages.from_date_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
