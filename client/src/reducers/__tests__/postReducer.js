import { 
  ADD_POST,
  GET_POSTS,
  GET_POST,
  DELETE_POST,
  POST_LOADING } from '../../actions/types';
import postReducer from '../postReducer';

const testPost = {
  id: 123,
  text: 'testString'
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' };
    const initialState = { 
      posts: [],
      post: {},
      loading: false
    };

    expect(postReducer(undefined, action)).toEqual(initialState);
  });
});

describe('POST_LOADING', () => {
  test('returns the correct state', () => {
    const action = { type: POST_LOADING, payload: null };
    const expectedState = {
      posts: [],
      post: {},
      loading: true
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_POSTS', () => {
  test('returns the correct state', () => {
    const action = { type: GET_POSTS, payload: [testPost] };
    const expectedState = {
      posts: [testPost],
      post: {},
      loading: false
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('ADD_POST', () => {
  test('returns the correct state', () => {
    const action = { type: ADD_POST, payload: testPost };
    const expectedState = {
      posts: [testPost],
      post: {},
      loading: false
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_POST', () => {
  test('returns the correct state', () => {
    const action = { type: GET_POST, payload: testPost };
    const expectedState = {
      posts: [],
      post: testPost,
      loading: false
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
})

describe('DELETE_POST', () => {
  test('returns the correct state', () => {
    const action = { type: DELETE_POST, payload: testPost };
    const expectedState = {
      posts: [],
      post: {},
      loading: false
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
})