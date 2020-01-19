const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorMessages
export default (data: any, errorMessages: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = errorMessages.name_invalid_length;
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = errorMessages.name_field_required;
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = errorMessages.invalid_email;
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = errorMessages.password_invalid_length;
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = errorMessages.password_field_required;
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = errorMessages.confirm_password_field_required;
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = errorMessages.passwords_must_match;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
