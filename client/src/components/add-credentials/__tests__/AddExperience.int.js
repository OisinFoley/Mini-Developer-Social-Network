import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedAddExperience from '../AddExperience';
import event from '../../../__mocks__/event';
import { mockStore } from '../../../__mocks__/mockStore';

const errors = {};
let mockState = {
  errors
}
const mockExperienceStore = mockStore(mockState);

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <Provider store={mockExperienceStore} >
      <MemoryRouter>
        <ConnectedAddExperience />
      </MemoryRouter>
    </Provider>
  );
});

describe('<AddExperience />', () => {
  it("mounts and, when all inputs are updated, then state is updated for each", () => {
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
  });
});