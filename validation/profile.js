const Validator = require('validator');
const isEmpty = require('./is-empty');
const errorMessages = require('../error-handling/strings');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = errorMessages.handle_invalid_length;
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = errorMessages.handle_required;
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = errorMessages.status_required;
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = errorMessages.skills_required;
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = errorMessages.invalid_url;
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = errorMessages.invalid_url;
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = errorMessages.invalid_url;
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = errorMessages.invalid_url;
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = errorMessages.invalid_url;
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = errorMessages.invalid_url;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
