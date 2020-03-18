import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';

import Spinner from '../common/Spinner';
import PostItem from '../posts/PostItem';
import { getPost } from '../../actions/postActions';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import BackButton from '../common/BackButton';
import { Post as PostAbstraction } from 'devconnector-types/interfaces';
import { PostComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  post: { 
    post: PostAbstraction,
    loading: boolean,
  };
}

interface DispatchProps {
  getPost: (id: string) => void;
}

interface MatchParams {
  id: string;
}

interface OwnProps extends RouteChildrenProps<MatchParams> {}

type Props = StateProps & DispatchProps & OwnProps;

export class Post extends Component<Props> {
  componentDidMount() {
    if (this.props.match?.params.id) {
      this.props.getPost(this.props.match.params.id);
    }
  }

  render() {
    const { post, loading } = this.props.post;
    let postContent;
    let postContainsData = Object.keys(post).length > 0;

    if (!postContainsData || loading) {
      postContent = 
        <Spinner />  
    } else {
      postContent = 
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <CommentFeed postId={post._id} comments={post.comments} />     
        </div>
    }

    return (
      <div className="post">
        <div className="md-container">
          <div className="row">
            <div className="col-md-12">
              <BackButton route='feed' additionalClasses='mb-3' />
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: PostComponentState): StateProps => ({
  post: state.post
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { getPost }
)(Post);