import Validator from 'validator';

import { Experience, ErrorResponse, ValidationResponse } from "devconnector-types/interfaces";
import invalidDate from '../utils/invalid-date';
import isEmpty from './is-empty';

export default (data: Experience, errorStrings: any): ValidationResponse => {
  let errors: ErrorResponse = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : invalidDate;

  if (Validator.isEmpty(data.title)) {
    errors.title = errorStrings.title_field_required;
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = errorStrings.company_field_required;
  }

  if (data.from === invalidDate) {
    errors.from = errorStrings.from_date_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
