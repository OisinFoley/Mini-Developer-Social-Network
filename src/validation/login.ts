import ILoginUserInput from "../interfaces/ILoginUserInput";

const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorStrings
export default (data: ILoginUserInput, errorStrings: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = errorStrings.invalid_email;
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = errorStrings.email_field_required;
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = errorStrings.password_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
