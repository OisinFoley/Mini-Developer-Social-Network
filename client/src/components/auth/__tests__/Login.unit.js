import React from 'react';
import { shallow } from 'enzyme';
import ConnectedLogin, { Login } from '../Login';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockIsAuthState, mockIsNotAuthState } from '../../../__mocks__/mockAuth';

const loginUser = jest.fn();
const push = jest.fn();
const history = { push };
let isNotAuthState = {
  ...mockIsNotAuthState,
  loginUser
}
const isAuthState = {
  ...mockIsAuthState
}
const mockIsNotAuthStore = mockStore(isNotAuthState);
const mockIsAuthStore = mockStore(isAuthState);

describe('<Login />', () => {
  it("shallow renders the Login component and, when not authenticated, then login form is shown", () => {
    const wrapper = shallow(<ConnectedLogin store={mockIsNotAuthStore} />);
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

  it("shallows renders Login, and when onSubmit event is fired, then it calls loginUser action", () => {
    const wrapper = shallow(<Login {...isNotAuthState} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(loginUser.mock.calls.length).toEqual(1);
  })
});