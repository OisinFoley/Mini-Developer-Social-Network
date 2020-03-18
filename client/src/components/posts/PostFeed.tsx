import React, { Component } from 'react';

import PostItem from './PostItem';
import { Post } from 'devconnector-types/interfaces';

interface Props {
  posts: Post[];
}

export class PostFeed extends Component<Props> {
  render() {
    const { posts } = this.props;

    return posts.map((post: Post, i: number) => <PostItem key={post._id} i={i} post={post} />);
  }
}

export default PostFeed;
