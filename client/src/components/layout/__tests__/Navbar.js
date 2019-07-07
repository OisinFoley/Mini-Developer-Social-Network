import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import Navbar from '../Navbar';

const mockStore = configureStore();
const notAuthenticatedState = {
  auth: {
    isAuthenticated: false
  }
};

const push = jest.fn();
const clearCurrentProfile = jest.fn();
const logoutUser = jest.fn();

const history = { push };

let avatar = 'http://test_avatar';

const isAuthenticatedState = {
  auth: {
    isAuthenticated: true,
    user: {
      avatar,
      name: 'test name'
    }
  }
};
const props = {
  clearCurrentProfile,
  logoutUser
}
const store = mockStore(notAuthenticatedState);
const isAuthenticatedStore = mockStore(isAuthenticatedState);


describe('<Navbar />', () => {
  //  change name of test
  it("renders the Navbar page and shows user's avatar when authenticated", () => {
    const wrapper = shallow(<Navbar store={isAuthenticatedStore} props={props} />);
    const component = wrapper.dive();
    console.log(component.find('img').debug());
    console.log(component.find('img').get(0).props.src);
    expect(component.find('img').get(0).props.src).toEqual(avatar);


    // need further testing here

    // expect(component.find('Link').get(0).props.children).toEqual('Sign Up');
    // expect(component.find('Link').get(1).props.to).toEqual('/login');
    // expect(component.find('Link').get(1).props.children).toEqual('Login');
    // expect(component.find('Link').length).toEqual(2);
    
    // console.log(component.find('Link').get(0).props.to);
    // console.log(component.find('Link').get(0).props.children);
    // console.log(component.find('Link').length);

    // expect(store.getActions()).toMatchSnapshot();
  });

});