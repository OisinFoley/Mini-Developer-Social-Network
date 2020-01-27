import IErrorResponse from "./IErrorResponse";

export default interface IValidationResponse {
  errors: IErrorResponse;
  isValid: boolean;
}