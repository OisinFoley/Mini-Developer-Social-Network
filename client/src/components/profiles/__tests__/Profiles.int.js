import React from 'react';
import { mount } from 'enzyme';
import { Profiles } from '../Profiles';
import { mockProfiles, loadingProfile } from '../../../__mocks__/mockProfiles';

const getProfiles = jest.fn();
const profile = {
  profiles: mockProfiles
};
const errors = {};
const mockState = {
  profile,
  getProfiles,
  loadingProfile,
  errors
}

it("mounts the Profiles component and, when is loading, then it shows Spinner component", () => {
  const wrapper = mount(<Profiles {...mockState} profile={loadingProfile} />);

  const spinner = wrapper.find('img.spinner');
  expect(spinner.length).toEqual(1);
})