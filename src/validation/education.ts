const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorMessages
export default (data: any, errorMessages: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = errorMessages.school_field_required;
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = errorMessages.degree_field_required;
  }

  if (Validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = errorMessages.fieldOfStudy_field_required;
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = errorMessages.from_date_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
