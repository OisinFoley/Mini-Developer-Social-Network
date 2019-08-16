const Validator = require('validator');
const isEmpty = require('./is-empty');
const errorMessages = require('../error-handling/strings');

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = errorMessages.school_field_required;
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = errorMessages.degree_field_required;
  }

  if (Validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = errorMessages.fieldOfStudy_field_required;
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = errorMessages.from_date_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
