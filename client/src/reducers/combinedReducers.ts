import { combineReducers } from 'redux';
import { authReducer } from '../reducers/authReducer';
import { errorReducer } from '../reducers/errorReducer';
import { profileReducer } from '../reducers/profileReducer';
import { postReducer } from '../reducers/postReducer';

export const combinedAuthErrorReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer 
});

export const combinedProfileAuthReducer = combineReducers({
  profile: profileReducer,
  auth: authReducer
});

export const combinedAuthReducer = combineReducers({
  auth: authReducer
});

export const combinedPostReducer = combineReducers({
  post: postReducer
});

export const combinedProfileReducer = combineReducers({
  profile: profileReducer
});

export const combinedProfileErrorReducer = combineReducers({
  profile: profileReducer,
  errors: errorReducer 
});