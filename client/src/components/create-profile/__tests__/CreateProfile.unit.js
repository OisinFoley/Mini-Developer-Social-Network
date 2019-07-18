import React from 'react';
import { shallow } from 'enzyme';
import { CreateProfile } from '../CreateProfile';
import event from '../../../__mocks__/event';

const createProfile = jest.fn();
const profile = {};
const errors = {};
const mockState = {
  profile,
  createProfile,
  errors
}

describe('<CreateProfile />', () => {
  it("shallow renders CreateProfile, then headers are shown", () => {
    const wrapper = shallow(<CreateProfile {...mockState} />);
    const component = wrapper;

    const mainHeaderText = component.find('h1');
    const subHeading = component.find('p');
    const textFieldGroupList = component.find('TextFieldGroup');
    const textAreaFieldGroupList = component.find('TextAreaFieldGroup');
    
    expect(mainHeaderText.text()).toEqual(`Create Your Profile`);
    expect(subHeading.text()).toEqual(`Provide some info to make your profile stand out!`);
    expect(textFieldGroupList.length).toEqual(6);
    expect(textAreaFieldGroupList.length).toEqual(1);
  });

  

  it("shallows renders CreateProfile, and when onSubmit event is fired, then it calls CreateProfile action", () => {
    const wrapper = shallow(<CreateProfile {...mockState} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(createProfile.mock.calls.length).toEqual(1);
  });

  it(`shallows renders CreateProfile, and when 'Add Social Network Links' button is clicked, 
    then displaySocialInputs state updates and 5 additional inputs are displayed`, () => {
    const wrapper = shallow(<CreateProfile {...mockState} />);

    expect(wrapper.state().displaySocialInputs).toEqual(false);
    expect(wrapper.find('InputGroup').length).toEqual(0);
    wrapper.find('button[type="button"]').simulate('click');

    expect(wrapper.state().displaySocialInputs).toEqual(true);
    expect(wrapper.find('InputGroup').length).toEqual(5);
    wrapper.find('button[type="button"]').simulate('click');

    expect(wrapper.state().displaySocialInputs).toEqual(false);
    expect(wrapper.find('InputGroup').length).toEqual(0);
  });
});

