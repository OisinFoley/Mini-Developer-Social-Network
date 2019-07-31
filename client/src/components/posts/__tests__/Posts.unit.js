import React from 'react';
import { shallow } from 'enzyme';
import { Posts } from '../Posts';
import { mockPosts } from '../../../__mocks__/mockPosts';

const getPosts = jest.fn();
const props = {
  posts: {
    posts: mockPosts,
    loading: false
  },
  getPosts
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<Posts {...props} />);
});

afterEach(() => {
  getPosts.mockReset();
});

describe('<Posts />', () => {
  it(`shallows renders Posts, and renders PostForm component`, () => {
    const postForm = wrapper.find('Connect(PostForm)');
    
    expect(postForm.length).toEqual(1);
  });

  it(`shallows renders Post, and when componentDidMount, then it calls getPosts action`, () => {
    expect(getPosts.mock.calls.length).toEqual(1);
  });
});