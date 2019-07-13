import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ConnectedLogin, { Login } from '../Login';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

let errors = {};
let mockIsNotAuthState = {
  auth: {
    isAuthenticated: false
  },
  errors
}

let mockIsAuthState = {
  auth: {
    isAuthenticated: true
  },
  user: {
    name: 'test_user'
  },
  errors
}

const loginUser = jest.fn();

const push = jest.fn();
const history = { push };


const props = {
  loginUser,
  history
}

const propsUnconnected = {
  loginUser,
  history,
  auth: {
    isAuthenticated: false
  },
  errors
}

const mockIsNotAuthStore = mockStore(mockIsNotAuthState);
const mockIsAuthStore = mockStore(mockIsAuthState);

describe('<Login />', () => {
  it("shallow renders the Login component and, when not authenticated, then login form is shown", () => {
    const wrapper = shallow(<ConnectedLogin store={mockIsNotAuthStore} props={props} />);
    const component = wrapper.dive();
    const mainHeaderText = component.find('h1');
    const subHeading = component.find('p');

    expect(mainHeaderText.text()).toEqual(`Log In`);
    expect(subHeading.text()).toEqual(`Sign in to your DevConnector account`);
  })

  it("shallow renders the Login component, when IS authenticated, then '/dashboard' is pushed to history", () => {
    const wrapper = shallow(<ConnectedLogin store={mockIsAuthStore} history={history} />);
    wrapper.dive();

    expect(history.push).toHaveBeenCalledWith('/dashboard');
  })

  it("email and password inputs are updated, then state is updated", () => {
    const wrapper = mount(<ConnectedLogin store={mockIsNotAuthStore} props={props} />);
    const component = wrapper;

    component.find('input[type="email"]').simulate('change', { target: { name: 'email' , value: 'test@email.com' } })
    component.find('input[type="email"]').simulate('change', { target: { name: 'password' , value: '123FakeStreet' } })

    let updatedEmailState = wrapper.children().state().email;
    let updatedPasswordState = wrapper.children().state().password;

    expect(updatedEmailState).toEqual(`test@email.com`);
    expect(updatedPasswordState).toEqual(`123FakeStreet`);
  })

  it("shallows renders Login, and when onSubmit event is fired, then it calls loginUser action", () => {
    const wrapper = shallow(<Login loginUser={loginUser} auth={propsUnconnected.auth} errors={propsUnconnected.errors} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(loginUser.mock.calls.length).toEqual(1);
  })

});