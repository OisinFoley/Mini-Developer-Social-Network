import React from 'react';
import { shallow } from 'enzyme';
import { AddExperience } from '../AddExperience';

const addExperience = jest.fn();

let wrapper;
beforeEach(() => {
  wrapper = shallow(<AddExperience addExperience={addExperience}/>);
});

describe('<AddExperience />', () => {
  it(`shallow renders the AddExperience component and AddExperience form is shown`, () => {
    const mainHeaderText = wrapper.find('h1');
    const subHeading = wrapper.find('p');
    const textAreaFieldGroupList = wrapper.find('TextFieldGroup');
    const form = wrapper.find('form');

    expect(mainHeaderText.text()).toEqual(`Add Experience`);
    expect(subHeading.text()).toEqual(`Add a job or position you currently work at or have in the past`);
    expect(textAreaFieldGroupList.length).toEqual(5);
    expect(form.length).toEqual(1);
  })

  it("shallows renders AddExperience, and when onSubmit event is fired, then it calls AddExperience action", () => {
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(addExperience.mock.calls.length).toEqual(1);
  })
});