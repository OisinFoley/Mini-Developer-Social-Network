import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ConnectedAddEducation, { AddEducation } from '../AddEducation';
import thunk from "redux-thunk";
import event from '../../../__mocks__/event';

const mockStore = configureStore([thunk]);
const addEducation = jest.fn();
const errors = {};
let mockState = {
  errors
}
const mockEducationStore = mockStore(mockState);

describe('<AddEducation />', () => {
  it("shallow renders the AddEducation component and, when not authenticated, then AddEducation form is shown", () => {
    const wrapper = shallow(<AddEducation store={mockEducationStore}  />);
    const component = wrapper;

    const mainHeaderText = component.find('h1');
    const subHeading = component.find('p');
    const textAreaFieldGroupList = component.find('TextFieldGroup');

    expect(mainHeaderText.text()).toEqual(`Add Education`);
    expect(subHeading.text()).toEqual(`Add academic education or coding training you've attended`);
    expect(textAreaFieldGroupList.length).toEqual(5);
  })

  it("mounts and, when all inputs are updated, then state is updated for each", () => {
    // this is something we can try in another component test
    // we got from SO, but wouldn't work because this component has a BackButton comp, which relies on router
    // const wrapper = mount(
    //   <ConnectedAddEducation />, {
    //     context: { store: mockEducationStore }
    //   }
    // );

    const wrapper = mount(
      <Provider store={mockEducationStore} >
        <Router>
          <ConnectedAddEducation />
        </Router>
      </Provider>
    );

    const component = wrapper.find('AddEducation');

    component.find('input[name="school"]').simulate('change', { target: event('school', 'test_school') })
    component.find('input[name="degree"]').simulate('change', { target: event('degree', 'test_degree') })
    component.find('input[name="fieldOfStudy"]').simulate('change', { target: event('fieldOfStudy', 'test_fieldOfStudy') })
    component.find('input[name="from"]').simulate('change', { target: event('from', '01/01/2000') })
    component.find('input[name="to"]').simulate('change', { target: event('to', '01/01/2010') })
    component.find('input[name="current"]').simulate('change', { target: event('current', true) })
    component.find('textarea[name="description"]').simulate('change', { target: event('description', 'test_description') })

    expect(component.state().school).toEqual(`test_school`);
    expect(component.state().degree).toEqual(`test_degree`);
    expect(component.state().fieldOfStudy).toEqual(`test_fieldOfStudy`);
    expect(component.state().from).toEqual(`01/01/2000`);
    expect(component.state().to).toEqual(`01/01/2010`);
    expect(component.state().current).toEqual(true);
    expect(component.state().description).toEqual(`test_description`);
  })

  it("shallows renders AddEducation, and when onSubmit event is fired, then it calls AddEducation action", () => {
    const wrapper = shallow(<AddEducation addEducation={addEducation} />);
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(addEducation.mock.calls.length).toEqual(1);
  })
});
