import React from 'react';
import mockAxios from 'axios';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router';
import App from '../App';
import Landing from '../components/layout/Landing';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import Dashboard from '../components/dashboard/Dashboard';
import Profiles from '../components/profiles/Profiles';
import { mockStore } from '../__mocks__/mockStore';
// import localStorageMock from '../setupTests';

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTc3MjMxOGEwZWZhMTFlN2E2ODAxNCIsIm5hbWUiOiJPaXPDrW4gRm9sZXkiLCJhdmF0YXIiOiJodHRwczovL2FuZ2VsLmNvL2Nkbi1jZ2kvaW1hZ2Uvd2lkdGg9MjAwLGhlaWdodD0yMDAsZm9ybWF0PWF1dG8sZml0PWNvdmVyL2h0dHBzOi8vZDFxYjJuYjVjem5hdHUuY2xvdWRmcm9udC5uZXQvdXNlcnMvMjA5NDkzMi1vcmlnaW5hbD8xNTYzNzI1OTgyIiwiaWF0IjoxNTYzODE5NDUxLCJleHAiOjE1NjM4MjMwNTF9.iHngRNoz-WinG9GNVMYWq1-y0H0hao29G5DxwLklEnI';
const dateNow = Date.now() / 1000;
const validExpiry = dateNow + 60000;
const setTokenAsHeader = jest.fn();
const jwt_decode = jest.fn().mockImplementation(() => {
  return {
    exp: validExpiry
  }
});
const localStorage = {
  jwtToken: token
};

const state = {
  localStorage,
  jwt_decode,
  setTokenAsHeader
};

//  see if we can mock this component, otherwise the tests that we have got to pass here,
// will end up affecting test elsewhere in the wider picture

// also, try to see if you can mock the localStorage PER TEST, so that the mock only runs in this test file
jest.mock('jwt_decode');

// const jwt_decode = jest.fn();

const store = mockStore(state);

describe('<App />', () => {
  test("when path is '/profiles', then should direct to non-private Profiles component", () => {
    
        const wrapper = mount(
          <MemoryRouter initialEntries={[ '/Profiles' ]}>
            <App />
          </MemoryRouter>
        );
        
        console.log(wrapper.find(Profiles).length);
        expect(wrapper.find(Profiles)).toHaveLength(1);
  });

  test(`when path is '/dashboard' and mocked jwt is expired, then should redirect to Login,
        instead of private Dashboard component `, () => {
    
        const wrapper = mount(
          <MemoryRouter initialEntries={[ '/Dashboard' ]}>
            <App />
          </MemoryRouter>
        );
        
        console.log(wrapper.find(Login).length);
        expect(wrapper.find(Login)).toHaveLength(1);
  });

  
  // rename this test -> what are we even testing??
  test(`when localStorage.jwtToken is true and is valid,
        then it calls setTokenAsHeader util, jwt_decode
        and dispatches setCurrentUser action`, () => {

          const wrapper = shallow(
            <MemoryRouter initialEntries={[ '/' ]}>
              <App 
                token={token}
                jwt_decode={jwt_decode}
                localStorage={localStorage}
                setTokenAsHeader={setTokenAsHeader}
                store={store}
              />
            </MemoryRouter>
          );
          console.log(jwt_decode.mock.calls.length);
  });
})