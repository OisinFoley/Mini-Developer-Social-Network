import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import Landing from '../Landing';

const mockStore = configureStore();
const notAuthenticatedState = {
  auth: {
    isAuthenticated: false
  }
};

const push = jest.fn();
const history = { push };

const isAuthenticatedState = {
  auth: {
    isAuthenticated: true
  }
};
const store = mockStore(notAuthenticatedState);
const isAuthenticatedStore = mockStore(isAuthenticatedState);

describe('<Landing />', () => {
  it('renders the Landing page when not authenticated', () => {
    const wrapper = shallow(<Landing store={store} />);
    const component = wrapper.dive();
    // console.log(component.find('Link').debug());
    let linkComponents = component.find('Link');

    expect(linkComponents.get(0).props.to).toEqual('/register');
    expect(linkComponents.get(0).props.children).toEqual('Sign Up');
    expect(linkComponents.get(1).props.to).toEqual('/login');
    expect(linkComponents.get(1).props.children).toEqual('Login');
    expect(linkComponents.length).toEqual(2);
    // expect(store.getActions()).toMatchSnapshot();
  });


  it('pushes /dashboard to history when isAuthenticated is true', () => {
    const wrapper = shallow(<Landing store={isAuthenticatedStore} history={history} />);
    const component = wrapper.dive();
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

});