import { GET_ERRORS, CLEAR_ERRORS, ErrorActionTypes, ErrorState } from '../types/actionTypes';

const initialState = {};

export const errorReducer = (
  state: ErrorState = initialState, action: ErrorActionTypes
): ErrorState => {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return {};
  }
}
