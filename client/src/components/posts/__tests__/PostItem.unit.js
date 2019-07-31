import React from 'react';
import { shallow } from 'enzyme';
import { PostItem } from '../PostItem';
import { mockPosts, likesListToTriggerFalsy } from '../../../__mocks__/mockPosts';
import { mockAuth } from '../../../__mocks__/mockAuth';

const deletePost = jest.fn();
const addLike = jest.fn();
const deleteLike = jest.fn();
const { auth } = mockAuth;
const props = {
  deletePost,
  addLike,
  deleteLike,
  post: mockPosts[0],
  auth
};

const propsAndShowActions = {
  ...props,
  showActions: true
};

const propsAndDoNotShowActions = {
  ...props,
  showActions: false
};

const propsAndHasNoLikes = {
  ...propsAndShowActions,
  post: {
    ...mockPosts[0],
    likes: [{
      "_id":"5d1c3c97a5aa791b72152b17",
      "user":"test_id_12345",
    }, {
      "_id":"5d1c3c97a5aa791b72152b17",
      "user":"test_id_90210",
    }]
  }
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<PostItem {...propsAndShowActions} />);
});

describe('<PostItem />', () => {
  it(`shallows renders PostItem, and when showActions is true,
      then it renders Link to the comments for a post`, () => {
        const linkComponent = wrapper.find('Link');
        
        expect(linkComponent.length).toEqual(1);
  });

  it(`shallows renders PostItem, and when showActions is false,
      then it doesn't render any Link components`, () => {
        const wrapper = shallow(<PostItem {...propsAndDoNotShowActions} />);
        const linkComponent = wrapper.find('Link');
        
        expect(linkComponent.length).toEqual(0);
  });

  it(`shallows renders PostItem, and when user who created the post matches the authenticated user,
      then it displays delete button`, () => {
        const deleteBtnModalToggle = wrapper.find('button.posts-comments-feed__delete-item-button');
        
        expect(deleteBtnModalToggle.length).toEqual(1);
  });

  it(`shallows renders PostItem, and when onLikeClick event fires,
      then it triggers addLike action`, () => {
        wrapper.find('button.posts-comments-feed__like-btn').simulate('click');
        
        expect(addLike.mock.calls.length).toEqual(1);
  });

  it(`shallows renders PostItem, and when onUnlikeClick event fires,
      then it triggers deleteLike action`, () => {
        wrapper.find('button.posts-comments-feed__unlike-btn').simulate('click');
        
        expect(deleteLike.mock.calls.length).toEqual(1);
  });

  it(`shallows renders PostItem, and when likes list contains id of authenticated user,
      then findUserLikes returns true`, () => {
        expect(wrapper.instance().findUserLikes(mockPosts[0].likes)).toEqual(true);
  });

  it(`shallows renders PostItem, and when likes list does not contains id of authenticated user,
      then findUserLikes returns false`, () => {
        expect(wrapper.instance().findUserLikes(likesListToTriggerFalsy)).toEqual(false);
  });
});