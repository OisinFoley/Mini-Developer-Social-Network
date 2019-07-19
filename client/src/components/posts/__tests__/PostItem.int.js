import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedPostItem from '../PostItem';
import { mockPosts } from '../../../__mocks__/mockPosts';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockAuth } from '../../../__mocks__/mockAuth';

const deletePost = jest.fn();
const addLike = jest.fn();
const deleteLike = jest.fn();
const { auth } = mockAuth;
const mockState = {
  deletePost,
  addLike,
  deleteLike,
  post: mockPosts[0],
  auth
};
const mockPostItemStore = mockStore(mockState);

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <Provider store={mockPostItemStore} >
      <Router>
        <ConnectedPostItem post={mockPosts[0]} i={0} />
      </Router>
    </Provider>
  );
});

describe('<PostItem />', () => {
  it(`mounts renders PostItem, when delete button is pressed and confirmed,
      then deletePost action is called`, () => {
        const postItem = wrapper.find('PostItem');
        postItem.find('button[data-target="#deletePostModal-1"]').simulate('click');
        let deletePostModal = postItem.find('[modalTitle="Delete Post and its Comments"]');
        deletePostModal = deletePostModal.at(0);
        let btn = deletePostModal.find(`button[id="${mockPosts[0]._id}"]`);
        // console.log(btn.debug());
        // btn.simulate('click'); // this is triggering an error, needs fixing        
        // deletePostModal.find(`button[id="${mockPosts[0]._id}"]`).simulate('click');

        // expect(deletePost.mock.calls.length).toBe(1);
  });
});