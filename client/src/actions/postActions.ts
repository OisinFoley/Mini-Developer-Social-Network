import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';

import {
  CLEAR_ERRORS,
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  GET_POST,
  DELETE_POST,
  POST_LOADING
} from '../types/actionTypes';
import { PostInput, Post, CommentInput } from 'devconnector-types/interfaces';

export const addPost = (postData: PostInput) => (dispatch: Dispatch) => {
  dispatch(clearErrors());
  return axios
    .post('/api/posts', postData)
    .then((res: AxiosResponse<Post>) =>
      dispatch({
        type: ADD_POST,
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

export const getPosts: any = () => (dispatch: Dispatch) => {
  dispatch(setPostLoading());
  return axios
    .get('/api/posts')
    .then((res: AxiosResponse<Post[]>) =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: err.response.data
      })
    );
};

export const getPost = (id: string) => (dispatch: Dispatch) => {
  dispatch(setPostLoading());
  return axios
    .get(`/api/posts/${id}`)
    .then((res: AxiosResponse<Post>) =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: err.response.data
      })
    );
};

export const deletePost = (id: string) => (dispatch: Dispatch) => {
  return axios
    .delete(`/api/posts/${id}`)
    .then(() =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addLike = (id: string) => (dispatch: Dispatch) => {
  return axios
    .post(`/api/posts/${id}/likes`)
    .then(() => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteLike = (id: string) => (dispatch: Dispatch) => {
  return axios
    .delete(`/api/posts/${id}/likes`)
    .then(() => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addComment = (postId: string, comment: CommentInput) => (dispatch: Dispatch) => {
  dispatch(clearErrors());
  return axios
    .post(`/api/posts/${postId}/comments`, comment)
    .then((res: AxiosResponse<Post>) =>
      dispatch({
        type: GET_POST,
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

export const deleteComment = (postId: string, commentId: string) => (dispatch: Dispatch) => {
  return axios
    .delete(`/api/posts/${postId}/comments/${commentId}`)
    .then((res: AxiosResponse<Post>) =>
      dispatch({
        type: GET_POST,
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

export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
