import isEmpty from '../validation/is-empty';
import { SET_CURRENT_USER, AuthState, AuthActionTypes } from '../types/actionTypes';
import { emptyUser } from '../utils/empty-object-states';

const initialState = {
  isAuthenticated: false,
  user: emptyUser
};

export const authReducer = (
  state: AuthState = initialState, action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
