import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../common/Spinner';
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import { getPosts } from '../../actions/postActions';
import { Post } from 'devconnector-types/interfaces';
import { PostsComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  posts: {
    posts: Post[];
    loading: boolean;
  };
}

interface DispatchProps {
  getPosts: () => void;
}

type Props = StateProps & DispatchProps;

export class Posts extends Component<Props> {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.posts;
    let postContent;

    postContent = posts === null || loading
      ? <Spinner />
      : <PostFeed posts={posts} />;

    return (
      <div className="feed">
        <div className="md-container">
          <div className="row">
            <div className="col-md-12">
              <PostForm />
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: PostsComponentState): StateProps => ({
  posts: state.post
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { getPosts }
)(Posts);
