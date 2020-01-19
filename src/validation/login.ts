const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorMessages
export default (data: any, errorMessages: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

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
