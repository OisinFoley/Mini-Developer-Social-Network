import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ConnectedCreateProfile, { CreateProfile } from '../CreateProfile';
import thunk from "redux-thunk";
import event from '../../../__mocks__/event';

const mockStore = configureStore([thunk]);
const createProfile = jest.fn();
const profile = {};
const errors = {};
let mockState = {
  profile,
  errors
}
const mockCreateProfileStore = mockStore(mockState);

describe('<CreateProfile />', () => {
  it("shallow renders the CreateProfile component and headers are shown", () => {
    const wrapper = shallow(<CreateProfile profile={profile} errors={errors} />);
    const component = wrapper;

    const mainHeaderText = component.find('h1');
    const subHeading = component.find('p');
    const textFieldGroupList = component.find('TextFieldGroup');
    const textAreaFieldGroupList = component.find('TextAreaFieldGroup');
    

    expect(mainHeaderText.text()).toEqual(`Create Your Profile`);
    expect(subHeading.text()).toEqual(`Provide some info to make your profile stand out!`);
    expect(textFieldGroupList.length).toEqual(6);
    expect(textAreaFieldGroupList.length).toEqual(1);
  })

  it("mounts and, when all inputs are updated, then state is updated for each", () => {
    const wrapper = mount(
      <Provider store={mockCreateProfileStore} displaySocialInputs={false} >
        <Router>
          <ConnectedCreateProfile />
        </Router>
      </Provider>
    );

    const component = wrapper.find('CreateProfile');

    component.find('input[name="handle"]').simulate('change', { target: event('handle', 'test_handle') });
    component.find('select[name="status"]').simulate('change', { target: event('status', 'Developer') });
    component.find('input[name="company"]').simulate('change', { target: event('company', 'test_company') });
    component.find('input[name="website"]').simulate('change', { target: event('website', 'test_website') });
    component.find('input[name="location"]').simulate('change', { target: event('location', 'test_location') });
    component.find('input[name="skills"]').simulate('change', { target: event('skills', 'test_skill0, test_skill1') });
    component.find('input[name="githubUsername"]').simulate('change', { target: event('githubUsername', 'test_githubUsername') });
    component.find('input[name="skills"]').simulate('change', { target: event('skills', 'test_skill0, test_skill1') });
    component.find('textarea[name="bio"]').simulate('change', { target: event('bio', 'test_bio') });

    expect(component.state().handle).toEqual(`test_handle`);
    expect(component.state().status).toEqual(`Developer`);
    expect(component.state().company).toEqual(`test_company`);
    expect(component.state().website).toEqual(`test_website`);
    expect(component.state().location).toEqual(`test_location`);
    expect(component.state().skills).toEqual(`test_skill0, test_skill1`);
    expect(component.state().bio).toEqual(`test_bio`);
  })

  it("shallows renders CreateProfile, and when onSubmit event is fired, then it calls CreateProfile action", () => {
    const wrapper = shallow(<CreateProfile createProfile={createProfile} profile={profile} errors={errors} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(createProfile.mock.calls.length).toEqual(1);
  })

  it(`shallows renders CreateProfile, and when 'Add Social Network Links' button is clicked, 
    then displaySocialInputs state updates and 5 additional inputs are displayed`, () => {
    const wrapper = shallow(<CreateProfile profile={profile} errors={errors} />);

    expect(wrapper.state().displaySocialInputs).toEqual(false);
    expect(wrapper.find('InputGroup').length).toEqual(0);
    wrapper.find('button[type="button"]').simulate('click');

    expect(wrapper.state().displaySocialInputs).toEqual(true);
    expect(wrapper.find('InputGroup').length).toEqual(5);
    wrapper.find('button[type="button"]').simulate('click');

    expect(wrapper.state().displaySocialInputs).toEqual(false);
    expect(wrapper.find('InputGroup').length).toEqual(0);
  })
});

