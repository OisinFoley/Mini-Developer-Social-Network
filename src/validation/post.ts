import IPostData from "../interfaces/IPostData";
import IErrorResponse from "../interfaces/IErrorResponse";
import IValidationResponse from "../interfaces/IValidationResponse";

const Validator = require('validator');
const isEmpty = require('./is-empty');

export default (data: IPostData, errorStrings: any): IValidationResponse => {
  let errors: IErrorResponse = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 6, max: 300 })) {
    errors.text = errorStrings.post_invalid_length;
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = errorStrings.text_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
