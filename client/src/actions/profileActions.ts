import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { History, LocationState } from "history";

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from '../types/actionTypes';
import {
  Profile,
  ProfileInput,
  EducationInput,
  ExperienceInput
} from 'devconnector-types/interfaces';

export const getCurrentProfile = () => (dispatch: Dispatch) => {
  dispatch(setProfileLoading());
  return axios
    .get('/api/profiles')
    .then((res: AxiosResponse<Profile>) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setProfile = (
  profileData: ProfileInput, history: History<LocationState>
) => (dispatch: Dispatch) => {
  return axios
    .post('/api/profiles', profileData)
    .then(() => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addEducation = (
  eduData: EducationInput, history: History<LocationState>
) => (dispatch: Dispatch) => {
  return axios
    .post('/api/profiles/educations', eduData)
    .then(() => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteEducation = (id: string) => (dispatch: Dispatch) => {
  return axios
    .delete(`/api/profiles/educations/${id}`)
    .then((res: AxiosResponse<Profile>) =>
      dispatch({
        type: GET_PROFILE,
        // returns profile minus the education that was deleted
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addExperience = (
  expData: ExperienceInput, history: History<LocationState>
) => (dispatch: Dispatch) => {
  return axios
    .post('/api/profiles/experiences', expData)
    .then(() => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getProfiles = () => (dispatch: Dispatch) => {
  dispatch(setProfileLoading());
  return axios
    .get('/api/profiles/all')
    .then((res: AxiosResponse<Profile[]>) =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getProfileByHandle = (handle: string) => (dispatch: Dispatch) => {
  dispatch(setProfileLoading());
  return axios
    .get(`/api/profiles/handle/${handle}`)
    .then((res: AxiosResponse<Profile>) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(() =>
      dispatch({
        type: GET_ERRORS,
        payload: null
      })
    );
};

export const deleteExperience = (id: string) => (dispatch: Dispatch) => {
  return axios
    .delete(`/api/profiles/experiences/${id}`)
    .then((res: AxiosResponse<Profile>) =>
      dispatch({
        type: GET_PROFILE,
        // returns profile minus the experience that was deleted
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteAccount = () => (dispatch: Dispatch) => {
  return axios
    .delete('/api/profiles')
    .then(() =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
