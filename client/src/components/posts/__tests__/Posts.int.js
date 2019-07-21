import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedPosts from '../Posts';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockAuth } from '../../../__mocks__/mockAuth';
import { mockPosts } from '../../../__mocks__/mockPosts';

const getPosts = jest.fn();
const { auth } = mockAuth;
const postsAndLoadingIsTrue = {
  posts: mockPosts,
  loading: true
}
const postsAndLoadingIsFalse = {
  ...postsAndLoadingIsTrue,
  loading: false
}
const mockIsLoadingState = {
  posts: postsAndLoadingIsTrue,
  post: postsAndLoadingIsTrue,
  getPosts,
  auth,
  errors: {}
};
const mockIsNotLoadingState = {
  posts: postsAndLoadingIsFalse,
  post: postsAndLoadingIsFalse,
  ...mockIsLoadingState
};
const mockIsLoadingPostsStore = mockStore(mockIsLoadingState);
const mockIsNotLoadingPostsStore = mockStore(mockIsNotLoadingState);

describe('<Posts />', () => {
  it(`mounts Post, and when posts are loading, then it displays Spinner and not PostFeed`, () => {
    const wrapper = mount(
      <Provider store={mockIsLoadingPostsStore} post={mockPosts} >
        <Router>
          <ConnectedPosts />
        </Router>
      </Provider>
    );
    const spinner = wrapper.find('img.spinner');
    const postFeed = wrapper.find('PostFeed');

    expect(spinner.length).toEqual(1);
    expect(spinner.get(0).props.alt).toEqual('Loading...');
    expect(postFeed.length).toEqual(0);
  });

  it(`mounts Posts, and when posts are not loading and not empty, then it displays PostFeed`, () => {
    const wrapper = mount(
      <Provider store={mockIsNotLoadingPostsStore} posts={mockPosts} post={mockPosts} >
        <Router>
          <ConnectedPosts />
        </Router>
      </Provider>
    );
    const postFeed = wrapper.find('PostFeed');
    const spinner = wrapper.find('img.spinner');

    expect(postFeed.length).toEqual(1);
    expect(spinner.length).toEqual(0);
  });
});