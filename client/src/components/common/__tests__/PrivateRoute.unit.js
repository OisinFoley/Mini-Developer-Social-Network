import React from 'react';
import { shallow } from 'enzyme';
import { PrivateRoute } from '../PrivateRoute';
import { mockAuth } from '../../../__mocks__/mockAuth';

const { auth } = mockAuth;
const isAuthProps = {
  auth,
  Component: 'Dashboard'
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

describe('<PrivateRoute />', () => {
  it(`shallow renders PrivateRoute, and when authenticated,
    then it renders Route and the passed in component is Dashboard`, () => {
      expect(wrapper.get(0).props.render().props.Component).toEqual('Dashboard');
  });

  it("shallows renders PrivateRoute, and when not authenticated, then it redirects to /login", () => {
    const wrapper = shallow(<PrivateRoute {...isAuthNotProps} />);

    expect(wrapper.get(0).props.render().props.to).toEqual('/login');
  });
});

