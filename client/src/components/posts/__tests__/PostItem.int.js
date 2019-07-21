import React from 'react';
import { mount } from 'enzyme';
import { PostItem } from '../PostItem';
import { mockPosts } from '../../../__mocks__/mockPosts';
import { mockAuth } from '../../../__mocks__/mockAuth';

const deletePost = jest.fn();
const addLike = jest.fn();
const deleteLike = jest.fn();
const { auth } = mockAuth;
const postState = {
  deletePost,
  addLike,
  deleteLike,
  post: mockPosts[0],
  auth,
  showActions: false,
  i: 0
};

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <PostItem {...postState} />
  );
});

describe('<PostItem />', () => {
  it(`mounts renders PostItem, when delete button is pressed and confirmed,
      then deletePost action is called`, () => {
        wrapper.find('button[data-target="#deletePostModal-1"]').simulate('click');
        let deletePostModal = wrapper.find('[modalTitle="Delete Post and its Comments"]');
        deletePostModal = deletePostModal.at(0);
        deletePostModal.find(`button[id="${mockPosts[0]._id}"]`).simulate('click');
        
        expect(deletePost.mock.calls.length).toBe(1);
  });
});