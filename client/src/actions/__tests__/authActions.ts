import mockAxios from 'axios';
import * as actions from '../authActions';
import * as types from '../../types/actionTypes';

jest.mock('jwt-decode', () => jest.fn().mockReturnValue({
  exp: 12345
}));

let store;
let storeActions;
let mock;
beforeEach(() => {
  store = mockStore();
  storeActions = store.getActions();
  mock = jest.spyOn(mockAxios, 'post');
});

describe("registerUser", () => {
  it('should register the user and redirect to login', () => {
    const push = jest.fn();
    const history = { push };

    return store.dispatch(actions.registerUser('the user data', history))
      .then(() => {
        expect(mock).toHaveBeenCalledWith('/api/users/register', 'the user data');
        expect(history.push).toHaveBeenCalledWith('/login');    
      });
  });
});

describe("loginUser", () => {
  it('should login the user, call localStorage.setItem, then dispatch setCurrentUser', () => {
    return store.dispatch(actions.loginUser('the user data'))
      .then(() => {
        expect(mock).toHaveBeenCalledWith('/api/users/login', 'the user data');
        expect(localStorage.setItem.mock.calls.length).toBe(1);
        expect(storeActions[0]).toEqual({ type: types.SET_CURRENT_USER, payload: { exp: 12345 } });    
      });
  });
});

describe("logoutUser", () => {
  it(`should log user out, call localStorage.removeItem then dispatche user 
      then dispatch setCurrentUser with empty payload`, () => {
      store.dispatch(actions.logoutUser());
      expect(localStorage.removeItem.mock.calls.length).toBe(1);
      expect(storeActions[0]).toEqual({ type: types.SET_CURRENT_USER, payload: {} });
  });
});