import IExperience from "../interfaces/IExperience";
import invalidDate from '../utils/invalid-date';
import IErrorResponse from "../interfaces/IErrorResponse";
import IValidationResponse from "../interfaces/IValidationResponse";

const Validator = require('validator');
const isEmpty = require('./is-empty');

export default (data: IExperience, errorStrings: any): IValidationResponse => {
  let errors: IErrorResponse = {};

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
