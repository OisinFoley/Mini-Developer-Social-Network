const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorMessages
export default (data: any, errorMessages: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = errorMessages.title_field_required;
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = errorMessages.company_field_required;
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = errorMessages.from_date_field_required;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
