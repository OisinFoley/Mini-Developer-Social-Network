import Validator from 'validator';

import ILoginUserInput from "../interfaces/ILoginUserInput";
import IErrorResponse from "../interfaces/IErrorResponse";
import IValidationResponse from "../interfaces/IValidationResponse";
import isEmpty from './is-empty';

export default (data: ILoginUserInput, errorStrings: any): IValidationResponse  => {
  let errors: IErrorResponse = {};

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
