import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PostItem from './PostItem';

export class PostFeed extends Component {
  render() {
    const { posts } = this.props;

    return posts.map((post, i) => <PostItem key={post._id} i={i} post={post} />);
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default PostFeed;
