import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import setTokenAsHeader from '../utils/setTokenAsHeader';
import jwt_decode from 'jwt-decode';

// reg user
export const registerUser = (userData, history) => dispatch => {
  return axios
    .post('/api/users/register', userData)
    .then(() => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// login and grab token, then attach to future headers
export const loginUser = userData => dispatch => {
  return axios
    .post('/api/users/login', userData)
    .then(res => {
      let { token } = res.data;

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
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// remove token from storage, and from future request headers
// update currentUser state
export const logoutUser = () => dispatch => {  
  localStorage.removeItem('jwtToken');

  setTokenAsHeader(false);

  dispatch(setCurrentUser({}));
};
