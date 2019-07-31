import React from 'react';
import { shallow } from 'enzyme';
import { Profiles } from '../Profiles';
import { mockProfiles, noProfiles } from '../../../__mocks__/mockProfiles';

const getProfiles = jest.fn();
const profile = {
  profiles: mockProfiles
};
const errors = {};
const mockState = {
  profile,
  getProfiles,
  errors
}
let wrapper;
beforeEach(() => {
  wrapper = shallow(<Profiles {...mockState} />);
});

describe('<Profiles />', () => {
  it("shallow renders the Profiles component and, when componentDidMount, then it calls getProfiles()", () => {
    expect(getProfiles.mock.calls.length).toEqual(1);
  })

  it("shallow renders the Profiles component and headers are shown", () => {
    const mainHeaderText = wrapper.find('h1');
    const subHeading = wrapper.find('p');

    expect(mainHeaderText.text()).toEqual(`Developer Profiles`);
    expect(subHeading.text()).toEqual(`Browse developers and interact through posts and comments`);
  })

  it("shallow renders the Profiles component and, when no profiles are in state, then 'no profiles' header is shown", () => {
    const wrapper = shallow(<Profiles {...mockState} profile={noProfiles} />);
    const mainHeaderText = wrapper.find('h4');

    expect(mainHeaderText.text()).toEqual(`No profiles found ...`);
  })
});
