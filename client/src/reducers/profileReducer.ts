import {
  PROFILE_LOADING,
  GET_PROFILE,
  GET_PROFILES,
  CLEAR_CURRENT_PROFILE,
  ProfileActionTypes,
  ProfileState
} from '../types/actionTypes';
import { emptyProfile } from '../utils/empty-object-states';

const initialState: ProfileState = {
  profile: emptyProfile,
  profiles: [],
  loading: false
};

export const profileReducer = (
  state: ProfileState = initialState, action: ProfileActionTypes
): ProfileState => {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: emptyProfile
      };
    default:
      return {
        ...state,
        loading: false
      }
  }
}
