import { SET_CURRENT_USER } from '../../actions/types';
import authReducer from '../authReducer';

const testUser = {
  user: 'testUser1'
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' };
    const initialState = { isAuthenticated: false, user: {} };

    expect(authReducer(undefined, action)).toEqual(initialState);
  });
});

describe('SET_CURRENT_USER', () => {
  test('returns the correct state', () => {
    const action = { type: SET_CURRENT_USER, payload: testUser };
    const expectedState = {
      user: testUser,
      isAuthenticated: true
     };

    expect(authReducer(undefined, action)).toEqual(expectedState);
  });
});