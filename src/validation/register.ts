import IRegisterInput from "../interfaces/IRegisterInput";
import IErrorResponse from "../interfaces/IErrorResponse";
import IValidationResponse from "../interfaces/IValidationResponse";

const Validator = require('validator');
const isEmpty = require('./is-empty');

export default (data: IRegisterInput, errorStrings: any): IValidationResponse => {
  let errors: IErrorResponse = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = errorStrings.name_invalid_length;
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = errorStrings.name_field_required;
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = errorStrings.invalid_email;
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = errorStrings.password_invalid_length;
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = errorStrings.password_field_required;
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = errorStrings.confirm_password_field_required;
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = errorStrings.passwords_must_match;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
