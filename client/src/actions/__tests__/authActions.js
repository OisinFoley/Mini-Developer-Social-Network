import mockAxios from 'axios';
import * as actions from '../authActions'
import * as types from '../types';
import { registerUser, loginUser, logoutUser } from '../authActions';
import { mockStore } from '../../test/utils/mockStore';
// import { createMemoryHistory } from 'history';

import { fakeUser } from '../../__mocks__/mockAuth';

test("expect the value passed in to be the value returned (not putting result into var before checking 'toBe')", () => {
  // const mock = jest.fn(() => "bar");

  const mock = jest.fn((abc) => abc);

  expect(mock("foo")).toBe("foo");

  // expect(mock("foo")).toBe("bar");
  // expect(mock).toHaveBeenCalledWith("foo");
});

describe("registerUser", () => {
  let mock;
  beforeEach(() => {
    mock = jest.spyOn(mockAxios, 'post');
  });
  afterEach(() => {
    mock.mockRestore();
  });

  it('should register the user and redirect to login', async () => {
    const push = jest.fn();
    const history = { push };
    const dispatch = jest.fn();

    await actions.registerUser('the user data', history)(dispatch);

    expect(mock).toHaveBeenCalledWith('/api/users/register', 'the user data');  // Success!
    expect(history.push).toHaveBeenCalledWith('/login');  // Success!
  });

  // it('should not register the user and dispatch GET_ERRORS instead', async () => {


    
  //   const store = mockStore();
  //   // const history = createMemoryHistory('/dashboard')
  //   await store.dispatch(registerUser('userData', [{ name: 'todd' }] )
  //     .catch(e => {
  //       expect(e).toEqual({
  //         type: GET_ERRORS,
  //         payload: 'err.response.data'
  //       })
  //     }) );
  //   const actions = store.getActions();

  //   console.log('window.history');
  //   console.log(window.history);

  //   // grab history object

  //   expect(actions[0]).toEqual({ type: types.POST_LOADING });
  // });
});