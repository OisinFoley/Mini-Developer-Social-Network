import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import App from '../App';
import Landing from '../components/layout/Landing';
import Login from '../components/auth/Login';
import { mockStore } from '../__mocks__/mockStore';
import jwt_decode from 'jwt-decode';
// import * as jwt_decode from 'jwt-decode';

const dateNow = Date.now() / 1000;
const validExpiry = dateNow + 60000;
const setTokenAsHeader = jest.fn();
const state = {
  localStorage,
  jwt_decode,
  setTokenAsHeader
};
const store = mockStore(state);

// TODO: find a way to mock return value on a per-test basis
// check for replies on StackOverflow question
jest.mock('jwt-decode', () => jest.fn().mockReturnValue({
  exp: 12345,
  somethingElse: 'test_value'
}));

describe('<App />', () => {
  test("when path is '/', then should direct to non-private Landing component", () => {

        const wrapper = mount(
          <MemoryRouter initialEntries={[ '/' ]}>
            <App />
          </MemoryRouter>
        );

        expect(wrapper.find(Landing)).toHaveLength(1);
  });

  test(`when path is '/dashboard' and mocked jwt is expired, then should redirect to Login,
        instead of private Dashboard component `, () => {
    
        const wrapper = mount(
          <MemoryRouter initialEntries={[ '/Dashboard' ]}>
            <App />
          </MemoryRouter>
        );

        expect(wrapper.find(Login)).toHaveLength(1);
  });
})