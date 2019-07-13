import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ConnectedRegister, { Register } from '../Register';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

const registerUser = jest.fn();

// const isAuth = {
//   auth: {
//     isAuthenticated: true
//   }
// };
// const isNotAuth = {
//   auth: {
//     isAuthenticated: false
//   }
// };
// const user = {
//   user: {
//     name: 'test_user'
//   }
// }

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

const push = jest.fn();
const history = { push };

const props = {
  registerUser,
  history
}

const propsUnconnected = {
  registerUser,
  history,
  auth: {
    isAuthenticated: false
  },
  errors
}

const mockIsNotAuthStore = mockStore(mockIsNotAuthState);
const mockIsAuthStore = mockStore(mockIsAuthState);

describe('<Register />', () => {
  it("shallow renders the Register component and, when not authenticated, then register form is shown", () => {
    const wrapper = shallow(<ConnectedRegister store={mockIsNotAuthStore} props={props} />);
    const component = wrapper.dive();
    
    const mainHeaderText = component.find('h1');
    const subHeading = component.find('p');

    expect(mainHeaderText.text()).toEqual(`Sign Up`);
    expect(subHeading.text()).toEqual(`Create your DevConnector account`);
  })

  it("shallow renders the Register component, when IS authenticated, then '/dashboard' is pushed to history", () => {
    const wrapper = shallow(<ConnectedRegister store={mockIsAuthStore} history={history} />);
    wrapper.dive();
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  })

  it("name, email, password and verify password inputs are updated, then state is updated", () => {
    const wrapper = mount(<ConnectedRegister store={mockIsNotAuthStore} props={props} />);
    const component = wrapper;

    component.find('input[name="name"]').simulate('change', { target: { name: 'name' , value: 'test_name' } })
    component.find('input[name="email"]').simulate('change', { target: { name: 'email' , value: 'test@email.com' } })
    component.find('input[name="password"]').simulate('change', { target: { name: 'password' , value: '123FakeStreet!' } })
    component.find('input[name="password2"]').simulate('change', { target: { name: 'password2' , value: '123FakeStreet!' } })

    let updatedNameState = wrapper.children().state().name;
    let updatedEmailState = wrapper.children().state().email;
    let updatedPasswordState = wrapper.children().state().password;
    let updatedPassword2State = wrapper.children().state().password2;

    expect(updatedNameState).toEqual(`test_name`);
    expect(updatedEmailState).toEqual(`test@email.com`);
    expect(updatedPasswordState).toEqual(`123FakeStreet!`);
    expect(updatedPassword2State).toEqual(`123FakeStreet!`);
  })

  it("shallows renders Register, and when onSubmit event is fired, then it calls registerUser action", () => {
    const wrapper = shallow(<Register registerUser={registerUser} auth={propsUnconnected.auth} errors={propsUnconnected.errors} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(registerUser.mock.calls.length).toEqual(1);
  })

});