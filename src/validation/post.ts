import IPostData from "../interfaces/IPostData";

const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorStrings
export default (data: IPostData, errorStrings: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

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
