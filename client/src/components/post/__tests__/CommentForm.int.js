import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedCommentForm from '../CommentForm';
import event from '../../../__mocks__/event';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockAuth } from '../../../__mocks__/mockAuth';
import { mockPosts } from '../../../__mocks__/mockPosts';

const { _id  } = mockPosts[0];
const { auth } = mockAuth;
const errors = {};
const mockState = {
  auth,
  errors
};

const mockCommentFormStore = mockStore(mockState);

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <Provider store={mockCommentFormStore} >
      <Router>
        <ConnectedCommentForm postId={_id} />
      </Router>
    </Provider>
  );
});

describe('<CommentForm />', () => {
  it(`mounts and, when TextAreaFieldGroup component is updated,
    then text state is updated based on input value`, () => {
    const component = wrapper.find('CommentForm');
    component.find('textarea[name="text"]').simulate('change', { target: event('text', 'test_text') })
    
    expect(component.state().text).toEqual(`test_text`);
  });
});