import React from 'react';
import { shallow } from 'enzyme';
import ConnectedDashboard from '../Dashboard';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockProfiles } from '../../../__mocks__/mockProfiles';

const { user: { name } } = mockProfiles[0];
const { handle } = mockProfiles[0];
const createProfileLink_ExpectedToValue = '/create-profile';
const createProfileText = 'Create Profile';
const onDeleteProfileClick = jest.fn();
const deleteAccount = jest.fn();
const getCurrentProfile = jest.fn();

const noProfileState = {
  auth: {
    user: {
      name
    }
  },
  profile: {
    profile: {},
    loading: false
  }
};
const hasProfileState = {
  ...noProfileState,
  profile: {
    profile: {
      handle,
      experience: [{}],
      education: [{}]
    }
  }
};
const isLoadingState = {
  ...noProfileState,
  profile: {
    ...noProfileState.profile,
    loading: true
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
    const wrapper = shallow(<ConnectedDashboard store={hasProfileStore} props={props} />);
    const component = wrapper.dive();
    const userHandleLink = component.find('Link');

    expect(userHandleLink.get(0).props.to).toEqual(`/profile/${handle}`);
    expect(userHandleLink.get(0).props.children).toEqual(name);
  })

  it(`shallow renders the Dashboard component and, when profile is loading,
    then there are zero Links to user handle`, () => {
    const wrapper = shallow(<ConnectedDashboard store={isLoadingStore} props={props} />);
    const component = wrapper.dive();
    const userHandleLink = component.find('Link');  
  
    expect(userHandleLink.length).toEqual(0);
  })

  it(`shallow renders the Dashboard component and, when no profile is provided and not loading,
    then there is a Link to create profile`, () => {
    const wrapper = shallow(<ConnectedDashboard store={noProfileStore} props={props} />);
    const component = wrapper.dive();
    const createProfileLink = component.find('Link');

    expect(createProfileLink.get(0).props.to).toEqual(createProfileLink_ExpectedToValue);
    expect(createProfileLink.get(0).props.children).toEqual(createProfileText);
    expect(createProfileLink.length).toEqual(1);
  })

});