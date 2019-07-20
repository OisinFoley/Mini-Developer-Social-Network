import React from 'react';
import { shallow } from 'enzyme';
import { CommentFeed } from '../CommentFeed';
import { mockPosts } from '../../../__mocks__/mockPosts';

const { _id, comments } = mockPosts[0];
const props = {
  comments,
  postId: _id
};
let wrapper;
beforeEach(() => {
  wrapper = shallow(<CommentFeed {...props} />);
});

describe('<CommentFeed />', () => {
  it(`shallows renders CommentFeed,
    and when a comment is passed to comments state,
    then it renders a CommentItem component`, () => {
    const commentItem = wrapper.find('Connect(CommentItem)');
    
    expect(commentItem.length).toEqual(1);
  })
});