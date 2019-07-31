import React from 'react';
import { shallow } from 'enzyme';
import ProfileHeader from '../ProfileHeader';
import { mockProfiles } from '../../../__mocks__/mockProfiles';

const profileWithNullOptionalValues = {
  ...mockProfiles[0],
  company: null,
  location: null,
  website: null,
  social: null
};

describe('<ProfileHeader />', () => {
  it('renders ProfileHeader, and shows name, avatar, company, location, and 5 different social media links', () => {
    const wrapper = shallow(<ProfileHeader profile={mockProfiles[0]} />);
    const imgAvatar = wrapper.find('img').get(0).props.src;
    const userNameHeader = wrapper.find('h1').at(0).text();
    const statusAndCompany = wrapper.find('p').at(0).text();
    const location = wrapper.find('p').at(1).text();
    const website = wrapper.find('a').get(0).props.href;
    const twitterHref = wrapper.find('a').get(1).props.href;
    const linkedinHref = wrapper.find('a').get(2).props.href;
    const instagramHref = wrapper.find('a').get(3).props.href;
    const facebookHref = wrapper.find('a').get(4).props.href;
    const youtubeHref = wrapper.find('a').get(5).props.href;

    expect(imgAvatar).toEqual(mockProfiles[0].user.avatar);
    expect(userNameHeader).toEqual(mockProfiles[0].user.name);
    expect(statusAndCompany).toEqual(`${mockProfiles[0].status} at ${mockProfiles[0].company}`);
    expect(location).toEqual(mockProfiles[0].location);
    expect(website).toEqual(mockProfiles[0].website);
    expect(twitterHref).toEqual(mockProfiles[0].social[0].twitter);
    expect(linkedinHref).toEqual(mockProfiles[0].social[0].linkedin);
    expect(instagramHref).toEqual(mockProfiles[0].social[0].instagram);
    expect(facebookHref).toEqual(mockProfiles[0].social[0].facebook);
    expect(youtubeHref).toEqual(mockProfiles[0].social[0].youtube);
  });

  it('renders ProfileHeader, and when optional params are not provided (company, location, website, social), then no info is displayed for those fields', () => {
    const wrapper = shallow(<ProfileHeader profile={profileWithNullOptionalValues} />);
    const statusAndCompany = wrapper.find('p').at(0).text();
    const location = wrapper.find('p').at(1).text();

    expect(statusAndCompany).toEqual(mockProfiles[0].status);
    expect(location).toEqual('');
    expect(wrapper.find('a').length).toEqual(0);
  });
});