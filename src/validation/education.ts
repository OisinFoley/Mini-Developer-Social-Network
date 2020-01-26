import IEducation from "../interfaces/IEducation";
import invalidDate from '../utils/invalid-date';

const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorStrings
export default (data: IEducation, errorStrings: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

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
