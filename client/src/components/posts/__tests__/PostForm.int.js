import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedPostForm from '../PostForm';
import event from '../../../__mocks__/event';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockAuth } from '../../../__mocks__/mockAuth';

const errors = {};
let mockState = {
  errors,
  auth: mockAuth
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
      const postForm = wrapper.find('PostForm');
      postForm.find('textarea[name="text"]').simulate('change', { target: event('text', 'test_text') })
      
      expect(postForm.state().text).toEqual(`test_text`);
  });
});