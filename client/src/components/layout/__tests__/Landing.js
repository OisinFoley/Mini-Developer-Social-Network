import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import Landing from '../Landing';

const mockStore = configureStore();
const initialState = {
  auth: {
    isAuthenticated: false
  }
};

const push = jest.fn();
const history = { push };

const initialIsAuthenticatedState = {
  auth: {
    isAuthenticated: true
  }
};
const store = mockStore(initialState);
const isAuthenticatedStore = mockStore(initialIsAuthenticatedState);

describe('<Landing />', () => {
  //  change name of test
  it('renders the Landing page when not authenticated', () => {
    const wrapper = shallow(<Landing store={store} />);
    const component = wrapper.dive();
    // console.log(component.find('Link').debug());

    expect(component.find('Link').get(0).props.to).toEqual('/register');
    expect(component.find('Link').get(0).props.children).toEqual('Sign Up');
    expect(component.find('Link').get(1).props.to).toEqual('/login');
    expect(component.find('Link').get(1).props.children).toEqual('Login');
    expect(component.find('Link').length).toEqual(2);
    
    // console.log(component.find('Link').get(0).props.to);
    // console.log(component.find('Link').get(0).props.children);
    // console.log(component.find('Link').length);

    // expect(store.getActions()).toMatchSnapshot();
  });


  it('pushes /dashboard to hsitory when isAuthenticated is true', () => {
    const wrapper = shallow(<Landing store={isAuthenticatedStore} history={history} />);
    const component = wrapper.dive();
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

});