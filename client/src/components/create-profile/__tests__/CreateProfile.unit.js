import React from 'react';
import { shallow } from 'enzyme';
import { CreateProfile } from '../CreateProfile';

const createProfile = jest.fn();
const profile = {};
const errors = {};
const mockState = {
  profile,
  createProfile,
  errors
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<CreateProfile {...mockState} />);
});

describe('<CreateProfile />', () => {
  it("shallow renders CreateProfile, then headers are shown", () => {
    const mainHeaderText = wrapper.find('h1');
    const subHeading = wrapper.find('p');
    const textFieldGroupList = wrapper.find('TextFieldGroup');
    const textAreaFieldGroupList = wrapper.find('TextAreaFieldGroup');
    
    expect(mainHeaderText.text()).toEqual(`Create Your Profile`);
    expect(subHeading.text()).toEqual(`Provide some info to make your profile stand out!`);
    expect(textFieldGroupList.length).toEqual(6);
    expect(textAreaFieldGroupList.length).toEqual(1);
  });

  it("shallows renders CreateProfile, and when onSubmit event is fired, then it calls CreateProfile action", () => {
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(createProfile.mock.calls.length).toEqual(1);
  });

  it(`shallows renders CreateProfile, and when 'Add Social Network Links' button is clicked, 
    then displaySocialInputs state updates and 5 additional inputs are displayed`, () => {
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

