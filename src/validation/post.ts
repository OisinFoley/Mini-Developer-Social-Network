import Validator from 'validator';

import { PostInput, ErrorResponse, ValidationResponse } from "devconnector-types/interfaces";
import isEmpty from './is-empty';

export default (data: PostInput, errorStrings: any): ValidationResponse => {
  let errors: ErrorResponse = {};

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
