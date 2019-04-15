import errorReducer from '../errorReducer';
import { GET_ERRORS, CLEAR_ERRORS } from '../../actions/types';

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' };
    const initialState = { isAuthenticated: false, user: {} };

    expect(errorReducer(undefined, action)).toEqual(initialState);
  });
});

describe('GET_ERRORS', () => {
  test('returns the correct state', () => {
    const action = { type: GET_ERRORS, payload: { nullNotAllowedError: 'id cannot be null' } };
    const expectedState = { nullNotAllowedError: 'id cannot be null' };

    expect(errorReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('CLEAR_ERRORS', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_ERRORS, payload: {} };
    const expectedState = {};

    expect(errorReducer(undefined, action)).toEqual(expectedState);
  });
});
