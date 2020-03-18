import Validator from 'validator';

import { Education, ErrorResponse, ValidationResponse } from "devconnector-types/interfaces";
import invalidDate from '../utils/invalid-date';
import isEmpty from './is-empty';

export default (data: Education, errorStrings: any): ValidationResponse => {
  let errors: ErrorResponse = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.from = !isEmpty(data.from) ? data.from : invalidDate;

  if (Validator.isEmpty(data.school)) {
    errors.school = errorStrings.school_field_required;
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = errorStrings.degree_field_required;
  }

  if (Validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = errorStrings.fieldOfStudy_field_required;
  }

  if (data.from === invalidDate) {
    errors.from = errorStrings.from_date_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};