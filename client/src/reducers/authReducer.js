import isEmpty from '../validation/is-empty';
import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        // action.payload for SET_CURRENT_USER should have decoded token info
        // so we're only authenticated if this prop isn't empty
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
