import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedAddEducation from '../AddEducation';
import event from '../../../__mocks__/event';
import { mockStore } from '../../../__mocks__/mockStore';

const errors = {};
let mockState = {
  errors
}
const mockEducationStore = mockStore(mockState);

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <Provider store={mockEducationStore} >
      <Router>
        <ConnectedAddEducation />
      </Router>
    </Provider>
  );
});

it(`mounts and, when all TextFieldGroup and TextAreaFieldGroup components are updated,
    then state is updated based on input values`, () => {
    // this is something we can try in another component test
    // we got from SO, but wouldn't work because this component has a BackButton comp, which relies on router
    // const wrapper = mount(
    //   <ConnectedAddEducation />, {
    //     context: { store: mockEducationStore }
    //   }
    // );

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