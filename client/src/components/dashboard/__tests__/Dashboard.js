import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import Dashboard from '../Dashboard';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

let loadingTrue = true;
let loadingFalse = false;
let name = 'test name';
let handle = 'test_user';
let createProfileLink_ExpectedToValue = '/create-profile';
let createProfileText = 'Create Profile';

const onDeleteProfileClick = jest.fn();
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
      handle,
      experience: [{}],
      education: [{}]
    },
    loading: loadingFalse
  }
};

const noProfileState = {
  auth: {
    user: {
      name
    }
  },
  profile: {
    profile: {},
    loading: loadingFalse
  }
};

const isLoadingState = {
  auth: {
    user: {
      name
    }
  },
  profile: {
    profile: null,
    loading: loadingTrue
  }
};

const props = {
  onDeleteProfileClick,
  deleteAccount,
  getCurrentProfile
}

const hasProfileStore = mockStore(hasProfileState);
const isLoadingStore = mockStore(isLoadingState);
const noProfileStore = mockStore(noProfileState);


describe('<Dashboard />', () => {
  it("shallow renders the Dashboard component and, when profile is provided, then has Link to user's handle and shows user's name", () => {
    const wrapper = shallow(<Dashboard store={hasProfileStore} props={props} />);
    const component = wrapper.dive();
    const userHandleLink = component.find('Link');

    expect(userHandleLink.get(0).props.to).toEqual(`/profile/${handle}`);
    expect(userHandleLink.get(0).props.children).toEqual(name);
  })

  it(`shallow renders the Dashboard component and, when profile is loading, 
    then there are zero Links to user handle`, () => {
    const wrapper = shallow(<Dashboard store={isLoadingStore} props={props} />);
    const component = wrapper.dive();
    const userHandleLink = component.find('Link');  
  
    expect(userHandleLink.length).toEqual(0);
  })

  it(`shallow renders the Dashboard component and, when no profile is provided and not loading, 
    then there is a Link to create profile`, () => {
    const wrapper = shallow(<Dashboard store={noProfileStore} props={props} />);
    const component = wrapper.dive();
    const createProfileLink = component.find('Link');

    expect(createProfileLink.get(0).props.to).toEqual(createProfileLink_ExpectedToValue);
    expect(createProfileLink.get(0).props.children).toEqual(createProfileText);
    expect(createProfileLink.length).toEqual(1);
  })

  // this is an integration test, because we're testing child components too
  it(`mounts the Dashboard component and, when 'Delete my Account' is clicked, a modal appears and after confirming 
    then deleteAccount function is called once`, () => {

    const wrapper = mount(
      <Provider store={hasProfileStore} props={props} >      
        <Router >
          <Dashboard />
        </Router>
      </Provider>
    );

    // it seems like we were trying to check if the mock we passe din was called,
    // but perhaps we need to grab the func that was passed in, and grab it as a prop of the wrapper
    // i have tried grabbing the prop, in order to check its mock prop in order to see if it was called (so we can assert on the prop, rather than the prop we defined here)
    // console.log(wrapper.props) -> this verifies that the prop exists in the wrapper
    // so far, nothing i have tried returns the actual onDeleteProfileClick prop.

    expect(onDeleteProfileClick.mock.calls.length).toBe(1);
  })

});