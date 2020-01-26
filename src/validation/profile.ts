import IProfileInput from "../interfaces/IProfileInput";
import IErrorResponse from "../interfaces/IErrorResponse";
import IValidationResponse from "../interfaces/IValidationResponse";

const Validator = require('validator');
const isEmpty = require('./is-empty');

export default (data: IProfileInput, errorStrings: any): IValidationResponse => {
  let errors: IErrorResponse = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = errorStrings.handle_invalid_length;
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = errorStrings.handle_required;
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = errorStrings.status_required;
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = errorStrings.skills_required;
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = errorStrings.invalid_url;
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = errorStrings.invalid_url;
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = errorStrings.invalid_url;
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = errorStrings.invalid_url;
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = errorStrings.invalid_url;
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = errorStrings.invalid_url;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
