import axios, { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { Dispatch } from 'redux';
import { History, LocationState } from "history";

import { GET_ERRORS, SET_CURRENT_USER } from '../types/actionTypes';
import setTokenAsHeader from '../utils/setTokenAsHeader';
import { RegisterInput, LoginInput, LoginResponse } from 'devconnector-types/interfaces';

export const registerUser = (
  registerData: RegisterInput, history: History<LocationState>
) => (dispatch: Dispatch) => {
  return axios
    .post('/api/users/register', registerData)
    .then(() => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// login and grab token, then include in headers for future requests
export const loginUser = (loginData: LoginInput) => (dispatch: Dispatch) => {
  return axios
    .post('/api/users/login', loginData)
    .then((res: AxiosResponse<LoginResponse>) => {
      const { token } = res.data;

      localStorage.setItem('jwtToken', token);

      setTokenAsHeader(token);

      const decoded = jwt_decode(token);

      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set logged in user
export const setCurrentUser = (decoded: any) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// remove token from storage, and from future request headers
// update currentUser state
export const logoutUser = () => (dispatch: Dispatch) => {
  localStorage.removeItem('jwtToken');

  setTokenAsHeader(null);

  dispatch(setCurrentUser({}));
};
