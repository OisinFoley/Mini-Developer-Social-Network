import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ConnectedAddExperience, { AddExperience } from '../AddExperience';
import thunk from "redux-thunk";
import event from '../../../__mocks__/event';

const mockStore = configureStore([thunk]);
const addExperience = jest.fn();
const errors = {};
let mockState = {
  errors
}
const mockExperienceStore = mockStore(mockState);

describe('<AddExperience />', () => {
  it("shallow renders the AddExperience component and, when not authenticated, then AddExperience form is shown", () => {
    const wrapper = shallow(<AddExperience store={mockExperienceStore}  />);
    const component = wrapper;

    const mainHeaderText = component.find('h1');
    const subHeading = component.find('p');
    const textAreaFieldGroupList = component.find('TextFieldGroup');

    expect(mainHeaderText.text()).toEqual(`Add Experience`);
    expect(subHeading.text()).toEqual(`Add a job or position you currently work at or have in the past`);
    expect(textAreaFieldGroupList.length).toEqual(5);
  })

  it("mounts and, when all inputs are updated, then state is updated for each", () => {
    const wrapper = mount(
      <Provider store={mockExperienceStore} >
        <Router>
          <ConnectedAddExperience />
        </Router>
      </Provider>
    );

    const component = wrapper.find('AddExperience');

    component.find('input[name="company"]').simulate('change', { target: event('company', 'test_company') });
    component.find('input[name="title"]').simulate('change', { target: event('title', 'test_title') })
    component.find('input[name="location"]').simulate('change', { target: event('location', 'test_location') })
    component.find('input[name="from"]').simulate('change', { target: event('from', '01/01/2000') })
    component.find('input[name="to"]').simulate('change', { target: event('to', '01/01/2010') })
    component.find('input[name="current"]').simulate('change', { target: event('current', true) })
    component.find('textarea[name="description"]').simulate('change', { target: event('description', 'test_description') })

    expect(component.state().company).toEqual(`test_company`);
    expect(component.state().title).toEqual(`test_title`);
    expect(component.state().location).toEqual(`test_location`);
    expect(component.state().from).toEqual(`01/01/2000`);
    expect(component.state().to).toEqual(`01/01/2010`);
    expect(component.state().current).toEqual(true);
    expect(component.state().description).toEqual(`test_description`);
  })

  it("shallows renders AddExperience, and when onSubmit event is fired, then it calls AddExperience action", () => {
    const wrapper = shallow(<AddExperience addExperience={addExperience} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(addExperience.mock.calls.length).toEqual(1);
  })
});