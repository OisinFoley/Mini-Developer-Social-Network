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
      <Provider store={hasProfileStore} props={props}>
        <Router >
          <Dashboard />
        </Router>
      </Provider>
    );
    
    wrapper.find('.dashboard__delete-account-btn').simulate('click');
    let deleteProfileModal = wrapper.find('[modalTitle="Delete Profile"]');

    console.log(deleteProfileModal.find('button#delete-profile-modal-confirm-btn').debug())
    deleteProfileModal.find('button#delete-profile-modal-confirm-btn').simulate('click');

    // this click is not registering a call to mocked function -> maybe we need to pass a mock to the nested component
    expect(deleteAccount.mock.calls.length).toBe(1);
  })

});