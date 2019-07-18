import * as actions from '../../actions/types';
import authReducer from '../authReducer';
import { initialMockState, initialMockAction } from '../__mocks__/initialAuthData';
import { testUser } from '../__mocks__/user';

const user = testUser;

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = initialMockAction;
    const initialState = initialMockState;

    expect(authReducer(undefined, action)).toEqual(initialState);
  });
});

describe('SET_CURRENT_USER', () => {
  test('returns the correct state', () => {
    const action = { type: actions.SET_CURRENT_USER, payload: user };
    const expectedState = {
      user,
      isAuthenticated: true
     };

    expect(authReducer(undefined, action)).toEqual(expectedState);
  });
});