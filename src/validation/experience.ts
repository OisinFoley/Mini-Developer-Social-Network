import IExperience from "../interfaces/IExperience";
import invalidDate from '../utils/invalid-date';

const Validator = require('validator');
const isEmpty = require('./is-empty');

// TODO: should data be of type 'any'
// add interface for errorStrings
export default (data: IExperience, errorStrings: any) => {
  // TODO: add interface where the props are nullable
  // so email?: string, password?: string etc
  let errors: any = {};

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
