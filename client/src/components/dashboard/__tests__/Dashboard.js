import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import Dashboard from '../Dashboard';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

let loadingTrue = true;
let loadingFalse = false;
let name = 'test name';

const deleteAccount = jest.fn();
const getCurrentProfile = jest.fn();

const hasProfileState = {
  auth: {
    user: {
      name
    }
  },
  profile: {
    profile: {
      handle: 'test_user',
      experience: {},
      education: {}
    },
    loading: loadingFalse
  }
};

const props = {
  deleteAccount,
  getCurrentProfile
}

const hasProfileStore = mockStore(hasProfileState);

describe('<Dashboard />', () => {
  //  change name of test
  it("shallow renders the Dashboard component and, when profile is provided, it has Link to user's handle and shows user's name", () => {
    const wrapper = shallow(<Dashboard store={hasProfileStore} props={props} />);
    const component = wrapper.dive();

    console.log(component.find('Link').get(0).debug());
    // const userHandleLink = component.find('Link').get(0);

    // const img = component.find('img');
    // const listItems = component.find('li');
    
    // expect(img.get(0).props.src).toEqual(avatar);
    // expect(img.get(0).props.alt).toEqual(name);
    // expect(listItems.length).toEqual(4);
  })
});