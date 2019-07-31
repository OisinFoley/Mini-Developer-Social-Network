import * as actions from '../../actions/types';
import postReducer from '../postReducer';
import { testPost } from '../__mocks__/post';
import { initialPostState } from '../__mocks__/initialPostState';

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' };
    const initialState = initialPostState;

    expect(postReducer(undefined, action)).toEqual(initialState);
  });
});

describe('POST_LOADING', () => {
  test('returns the correct state', () => {
    const action = { type: actions.POST_LOADING, payload: null };
    const expectedState = {
      ...initialPostState,
      loading: true
    };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_POSTS', () => {
  test('returns the correct state', () => {
    const action = { type: actions.GET_POSTS, payload: [testPost] };
    const expectedState = {
      ...initialPostState,
      posts: [testPost]
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('ADD_POST', () => {
  test('returns the correct state', () => {
    const action = { type: actions.ADD_POST, payload: testPost };
    const expectedState = {
      ...initialPostState,
      posts: [testPost]
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_POST', () => {
  test('returns the correct state', () => {
    const action = { type: actions.GET_POST, payload: testPost };
    const expectedState = {
      ...initialPostState,
      post: testPost
     };

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
})

describe('DELETE_POST', () => {
  test('returns the correct state', () => {
    const action = { type: actions.DELETE_POST, payload: testPost };
    const expectedState = initialPostState

    expect(postReducer(undefined, action)).toEqual(expectedState);
  });
})