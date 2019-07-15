import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ConnectedProfileItem, { ProfileItem } from '../ProfileItem';
import thunk from "redux-thunk";
import event from '../../../__mocks__/event';
import { mockProfiles, loadingProfile, noProfiles } from '../../../__mocks__/mockProfiles';

const mockStore = configureStore([thunk]);
const getProfiles = jest.fn();
const profile = mockProfiles[0];
let profileNoCompanyOrLocation = {
  ...profile,
  company: null,
  location: null
};

const errors = {};
let mockState = {
  profile
}
const mockProfileStore = mockStore(mockState);

describe('<ProfileItem />', () => {
  it("shallow renders the ProfileItem component and displays passed props", () => {
    const wrapper = shallow(<ProfileItem profile={profile} />);

    const userProfileImg = wrapper.find('img');
    const userProfileName = wrapper.find('#profiles-feed__users-profile-name');
    const userProfileStatus = wrapper.find('.profiles-feed__current-position');
    const userProfileLocation = wrapper.find('.profiles-feed__current-location');
    const userProfileSkills = wrapper.find('ul');
    const linkToHandleBtn = wrapper.find('Link');

    expect(userProfileImg.get(0).props.src).toEqual(profile.user.avatar)
    expect(userProfileName.text()).toEqual(profile.user.name)
    expect(userProfileStatus.text()).toEqual(`${profile.status} at ${profile.company}`)
    expect(userProfileLocation.text()).toEqual(profile.location)
    expect(linkToHandleBtn.get(0).props.to).toEqual(`/profile/${profile.handle}`)

    // Skills spliced to only show first 6 items 
    Array.from(Array(6)).forEach((el, i) => {
      expect(userProfileSkills.childAt(`${i}`).text().trim()).toEqual(profile.skills[`${i}`])  
    });
    expect(userProfileSkills.children().length).toEqual(6);
  })

  it(`shallow renders the ProfileItem component and,
    when company and location are not provided,
    then no info is rendered about those props`, () => {
    const wrapper = shallow(<ProfileItem profile={profileNoCompanyOrLocation} />);

    const userProfileStatus = wrapper.find('.profiles-feed__current-position');
    const userProfileLocation = wrapper.find('.profiles-feed__current-location');

    expect(userProfileStatus.text()).toEqual(`${profile.status} `);
    expect(userProfileLocation.text()).toEqual('');
  })
});