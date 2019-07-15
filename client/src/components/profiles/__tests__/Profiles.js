import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ConnectedProfiles, { Profiles } from '../Profiles';
import thunk from "redux-thunk";
import event from '../../../__mocks__/event';
import { mockProfiles, loadingProfile, noProfiles } from '../../../__mocks__/mockProfiles';

const mockStore = configureStore([thunk]);
const getProfiles = jest.fn();
const profile = {
  profiles: mockProfiles
};

const errors = {};
let mockState = {
  profile,
  getProfiles,
  errors
}
const mockProfilesStore = mockStore(mockState);

describe('<Profiles />', () => {
  it("shallow renders the Profiles component and, when componentDidMount, then it calls getProfiles()", () => {
    const wrapper = shallow(<Profiles profile={profile} errors={errors} getProfiles={getProfiles} />);

    expect(getProfiles.mock.calls.length).toEqual(1);
  })

  it("shallow renders the Profiles component and headers are shown", () => {
    const wrapper = shallow(<Profiles profile={profile} errors={errors} getProfiles={getProfiles} />);

    const mainHeaderText = wrapper.find('h1');
    const subHeading = wrapper.find('p');

    expect(mainHeaderText.text()).toEqual(`Developer Profiles`);
    expect(subHeading.text()).toEqual(`Browse developers and interact through posts and comments`);
  })

  it("shallow renders the Profiles component and, when no profiles are in state, then 'no profiles' header is shown", () => {
    const wrapper = shallow(<Profiles profile={noProfiles} errors={errors} getProfiles={getProfiles} />);
    const mainHeaderText = wrapper.find('h4');

    expect(mainHeaderText.text()).toEqual(`No profiles found ...`);
  })

  it("mounts the Profiles component and, when is loading, then it shows Spinner component", () => {
    const wrapper = mount(<Profiles profile={loadingProfile} errors={errors} getProfiles={getProfiles} />);
    const spinner = wrapper.find('img.spinner');
    expect(spinner.length).toEqual(1);
  })

});
