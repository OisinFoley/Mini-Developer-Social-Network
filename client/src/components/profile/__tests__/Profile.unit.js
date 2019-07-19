import React from 'react';
import { shallow } from 'enzyme';
import { Profile } from '../Profile';
import { mockProfiles } from '../../../__mocks__/mockProfiles';

const getProfileByHandle = jest.fn();
const push = jest.fn();
const history = { push };
const profile = {
  ...mockProfiles[0]
};

const mockProfileState = {
  profile : {
    profile
  },
  match: {
    params: {
      handle: 'test_handle'
    }
  },
  loading: false,
  getProfileByHandle
};

let profileNoGithubUsername = {
  profile: {
    profile: {
      ...mockProfiles[0]
    }
  },
  match: {
    params: {
      handle: 'test_handle'
    }
  },
  loading: false,
  getProfileByHandle
};
profileNoGithubUsername.profile.profile.githubUsername = null;
// console.log(profileNoGithubUsername);

const nullProfile = {
  profile: {
    profile: null,
    loading: true
  },
  match: {
    params: {
      handle: 'test_handle'
    }
  },
  getProfileByHandle
};

describe('<Profile />', () => {
  it("shallow renders Profile, and when github user name is provided, then it renders ProfileGithub component", () => {
    const wrapper = shallow(<Profile {...mockProfileState} />);
    const componentProfileGithub = wrapper.find('ProfileGithub');
    
    expect(componentProfileGithub.length).toEqual(1);
  });

  it("shallow renders Profile, and when github user name is not provided, then it does not renders ProfileGithub component", () => {
    const wrapper = shallow(<Profile {...profileNoGithubUsername} />);
    const componentProfileGithub = wrapper.find('ProfileGithub');
    
    expect(componentProfileGithub.length).toEqual(0);
  });

  // it.only(`shallow renders Profile, and when profile is null, then it renders Spinner component`, () => {
  //   const wrapper = shallow(<Profile {...nullProfile} />);
  //   // const wrapper = shallow(<Profile profile={nullProfile} />);
  //   const spinnerComponent = wrapper.find('Spinner');

  //   console.log(wrapper.debug())

  //   expect(spinnerComponent.length).toEqual(1);
  // });
})