import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedPostForm from '../PostForm';
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
        <ConnectedPostForm />
      </Router>
    </Provider>
  );
});

describe('<PostForm />', () => {
  it(`mounts and, when TextAreaFieldGroup components is updated,
    then 'text' state is updated based on input value`, () => {
    
    const component = wrapper.find('PostForm');

    component.find('input[name="text"]').simulate('change', { target: event('text', 'test_text') })
    

    expect(component.state().text).toEqual(`test_text`);
    
  });
});