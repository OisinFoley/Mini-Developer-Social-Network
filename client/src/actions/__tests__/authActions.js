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
  it(`registers user then pushes '/login' to history object`, async () => {
    const store = mockStore();
    // const history = createMemoryHistory('/dashboard')
    await store.dispatch(registerUser());
    const actions = store.getActions();

    console.log('window.history');
    console.log(window.history);

    // grab history object

    // expect(actions[0]).toEqual({type: types.POST_LOADING});
    // expect(actions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });
});

// describe("loginUser", () => {
//   it(`logs user in then sets state to SET_CURRENT_USER, and payload contains info on logged in user`, async () => {
//     const store = mockStore();
//     // const history = createMemoryHistory('/dashboard')
//     await store.dispatch(loginUser());
//     const actions = store.getActions();
//     expect(actions[0]).toEqual({ type: types.SET_CURRENT_USER , payload: fakeUser });
//   });
// });

// describe("logoutUser", () => {
//   it(`logs user out then sets state to SET_CURRENT_USER with an empty payload`, async () => {
//     const store = mockStore();
//     // const history = createMemoryHistory('/dashboard')
//     await store.dispatch(logoutUser());
//     const actions = store.getActions();
//     expect(actions[0]).toEqual({ type: types.SET_CURRENT_USER , payload: {} });
//   });
// });