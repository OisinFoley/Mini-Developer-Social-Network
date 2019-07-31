import errorReducer from '../errorReducer';
import * as actions from '../../actions/types';
import { initialMockState, initialMockAction } from '../__mocks__/initialAuthData';

const testNullNotAllowedObj = {
  nullNotAllowedError: 'id_cannot_be_null'
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' };

    expect(errorReducer(undefined, action)).toEqual(initialMockState);
  });
});

describe('GET_ERRORS', () => {
  test('returns the correct state', () => {
    const action = { type: actions.GET_ERRORS, payload: testNullNotAllowedObj };
    const expectedState = testNullNotAllowedObj;

    expect(errorReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('CLEAR_ERRORS', () => {
  test('returns the correct state', () => {
    const action = { type: actions.CLEAR_ERRORS, payload: {} };
    const expectedState = {};

    expect(errorReducer(undefined, action)).toEqual(expectedState);
  });
});
