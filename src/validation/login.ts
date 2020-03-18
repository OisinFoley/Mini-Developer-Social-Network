import Validator from 'validator';

import { LoginInput, ErrorResponse, ValidationResponse } from "devconnector-types/interfaces";
import isEmpty from './is-empty';

export default (data: LoginInput, errorStrings: any): ValidationResponse  => {
  let errors: ErrorResponse = {};

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
