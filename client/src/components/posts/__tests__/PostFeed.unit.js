import React from 'react';
import { shallow } from 'enzyme';
import { PostFeed } from '../PostFeed';
import { mockPosts } from '../../../__mocks__/mockPosts';

const props = {
  posts: mockPosts
};
let wrapper;
beforeEach(() => {
  wrapper = shallow(<PostFeed {...props} />);
});

describe('<PostFeed />', () => {
  it(`shallows renders PostFeed,
    and when a post is passed to posts state,
    then it renders a PostItem component`, () => {
    const postItem = wrapper.find('Connect(PostItem)');
    
    expect(postItem.length).toEqual(1);
  })
});