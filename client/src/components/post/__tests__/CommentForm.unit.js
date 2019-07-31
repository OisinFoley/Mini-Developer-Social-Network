import React from 'react';
import { shallow } from 'enzyme';
import { CommentForm } from '../CommentForm';
import { mockAuth } from '../../../__mocks__/mockAuth';
import { mockPosts } from '../../../__mocks__/mockPosts';

const addComment = jest.fn();
const { _id  } = mockPosts[0];
const { auth } = mockAuth;
const errors = {};
const props = {
  postId: _id,
  addComment,
  auth,
  errors
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<CommentForm {...props} />);
});

describe('<CommentForm />', () => {
  it(`shallows renders CommentForm,
    and when onSubmit event is fired,
    then it calls addComment action`, () => {
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(addComment.mock.calls.length).toEqual(1);
  })
});

