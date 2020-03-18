import { Post, Profile, User, ErrorResponse } from "devconnector-types/interfaces";

export const CLEAR_ERRORS          = 'CLEAR_ERRORS';
export const GET_ERRORS            = 'GET_ERRORS';
export const SET_CURRENT_USER      = 'SET_CURRENT_USER';
export const GET_PROFILE           = 'GET_PROFILE';
export const GET_PROFILES          = 'GET_PROFILES';
export const PROFILE_LOADING       = 'PROFILE_LOADING';
export const PROFILE_NOT_FOUND     = 'PROFILE_NOT_FOUND';
export const CLEAR_CURRENT_PROFILE = 'CLEAR_CURRENT_PROFILE';
export const POST_LOADING          = 'POST_LOADING';
export const GET_POSTS             = 'GET_POSTS';
export const GET_POST              = 'GET_POST';
export const ADD_POST              = 'ADD_POST';
export const DELETE_POST           = 'DELETE_POST';

/* Error Actions */

export interface GetErrorAction  {
  type: typeof GET_ERRORS;
  payload: ErrorResponse;
}

export interface ClearErrorAction {
  type: typeof CLEAR_ERRORS;
  payload: {};
}

export interface ErrorState extends ErrorResponse {}

export type ErrorActionTypes = GetErrorAction | ClearErrorAction;

/* Post Actions */

export interface AddPostAction {
  type: typeof ADD_POST;
  payload: Post;
}

export interface GetPostsAction {
  type: typeof GET_POSTS;
  payload: Post[];
}

export interface GetPostAction {
  type: typeof GET_POST;
  payload: Post;
}

export interface AddLikeAction {
  type: typeof GET_POST;
  payload: Post;
}

export interface DeletePostAction {
  type: typeof DELETE_POST;
  payload: string;
}

export interface PostLoadingAction {
  type: typeof POST_LOADING;
}

export interface PostState {
  posts: Post[];
  post: Post;
  loading: boolean;
}

export type PostActionsTypes =
  AddPostAction
  | GetPostsAction
  | GetPostAction
  | AddLikeAction
  | DeletePostAction
  | PostLoadingAction;

/* Profile Actions */

export interface GetProfileAction {
  type: typeof GET_PROFILE;
  payload: Profile;
}

export interface GetProfilesAction {
  type: typeof GET_PROFILES;
  payload: Profile[];
}

export interface ClearCurrentProfileAction {
  type: typeof CLEAR_CURRENT_PROFILE;
}

export interface ProfileLoadingAction {
  type: typeof PROFILE_LOADING;
}

export interface ProfileState {
  profile: Profile;
  profiles: Profile[];
  loading: boolean;
}

export type ProfileActionTypes
  = GetProfileAction
  | GetProfilesAction
  | ProfileLoadingAction
  | ClearCurrentProfileAction;

/* Auth Actions */

export interface SetCurrentUserAction {
  type: typeof SET_CURRENT_USER;
  payload: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User;
}

export type AuthActionTypes = SetCurrentUserAction;
