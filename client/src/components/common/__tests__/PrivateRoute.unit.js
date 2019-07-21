import React from 'react';
import { shallow } from 'enzyme';
import { PrivateRoute } from '../PrivateRoute';
import { mockAuth } from '../../../__mocks__/mockAuth';
import isEmpty from '../../../validation/is-empty';

const { auth } = mockAuth;
const isAuthProps = {
  auth,
  test: 123,
  test2: 456,
  test3: 'test_string',
  Component: 'TestComponent'
};
const isAuthNotProps = {
  ...isAuthProps,
  auth: {
    isAuthenticated: false
  }
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<PrivateRoute {...isAuthProps} />);
});

describe('<CreateProfile />', () => {
  it(`shallow renders PrivateRoute, and when authenticated,
    then it renders Route and the passed in component is TestComponent`, () => {

    expect(isEmpty(wrapper.get(0).props.render().props)).toEqual(true);
    expect(wrapper.get(0).props.Component).toEqual('TestComponent');
  });

  it("shallows renders CreateProfile, and when onSubmit event is fired, then it calls CreateProfile action", () => {
    const wrapper = shallow(<PrivateRoute {...isAuthNotProps} />);

    expect(wrapper.get(0).props.render().props.to).toEqual('/login');
  });
});

