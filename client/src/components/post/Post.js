import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import PostItem from '../posts/PostItem';
import { connect } from 'react-redux';
import { getPost } from '../../actions/postActions';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import BackButton from '../common/BackButton';

class Post extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;
    let postContent;

    loading || post === null || Object.keys(post).length === 0
      ? (postContent = <Spinner />)
      : (postContent = (
          <div>
            <PostItem post={post} showActions={false} />
            <CommentForm postId={post._id} />
            <CommentFeed postId={post._id} comments={post.comments} />
          </div>
        ));

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

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPost }
)(Post);
