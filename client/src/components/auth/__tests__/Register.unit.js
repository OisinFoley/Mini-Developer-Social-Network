import React from 'react';
import { shallow } from 'enzyme';
import ConnectedRegister, { Register } from '../Register';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockIsAuthState, mockIsNotAuthState } from '../../../__mocks__/mockAuth';

const registerUser = jest.fn();
const push = jest.fn();
const history = { push };
let isNotAuthState = {
  ...mockIsNotAuthState,
  registerUser
}
let isAuthState = {
  ...mockIsAuthState
}
const mockIsNotAuthStore = mockStore(isNotAuthState);
const mockIsAuthStore = mockStore(isAuthState);

describe('<Register />', () => {
  it("shallow renders the Register component and, when not authenticated, then register form is shown", () => {
    const wrapper = shallow(<ConnectedRegister store={mockIsNotAuthStore} />);
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


  it("shallows renders Register, and when onSubmit event is fired, then it calls registerUser action", () => {
    const wrapper = shallow(<Register {...isNotAuthState} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(registerUser.mock.calls.length).toEqual(1);
  })
});