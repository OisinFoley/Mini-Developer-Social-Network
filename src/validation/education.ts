import Validator from 'validator';

import IEducation from "../interfaces/IEducation";
import invalidDate from '../utils/invalid-date';
import IErrorResponse from "../interfaces/IErrorResponse";
import IValidationResponse from "../interfaces/IValidationResponse";
import isEmpty from './is-empty';

export default (data: IEducation, errorStrings: any): IValidationResponse => {
  let errors: IErrorResponse = {};

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