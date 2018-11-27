import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { deletePost, addLike, deleteLike } from '../../actions/postActions';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

class PostItem extends Component {
  onDeleteClick = id => {
    this.props.deletePost(id);
  }

  onLikeClick(id) {
    this.props.addLike(id);
  }

  onUnlikeClick(id) {
    this.props.deleteLike(id);
  }

  findUserLikes(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    }
    return false;
  }

  render() {
    const { post, i, auth, showActions } = this.props;
    return (
      // <div className="card card-body mb-3 comment-feed--individual-comment-container__padding">
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <span className="col-12">
            {post.user === auth.user.id ? (
              <button
                type="button"
                className="btn btn-danger mr-1 post-feed--delete-comment-button__float"
                data-toggle="modal"
                data-target={`#deletePostModal-${i+1}`}
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
            <ConfirmDeleteModal onDelete={this.onDeleteClick} modalId={`deletePostModal-${i+1}`} id={post._id} modalTitle='Delete Post and its Comments' modalBody='Are you sure you want to delete this Post? This cannot be undone.' />
            <img style={{float: "left"}} src={post.avatar} alt="" className="rounded-circle profilePhoto col-2" />
            <div id="profile-short-details-text">
              {/* <p id="users-profile-name">{post.name}</p> */}
              <p id="posters-profile-name">{post.name}</p>
            </div>
            <p className="lead post-feed--post-text-__width">{post.text}</p>
          </span>

          {/* <div className="col-10 offset-1" id='post-content-body'> */}
          <div className="col-10 offset-1" id='post-content-body'>
            {/* {post.user === auth.user.id ? (
                    <button
                      type="button"
                      className="btn btn-danger mr-1 post-feed--delete-comment-button__float"
                      data-toggle="modal"
                      data-target={`#deletePostModal-${i+1}`}
                    >
                      <i className="fas fa-times" />
                    </button>
                  ) : null}
            <ConfirmDeleteModal onDelete={this.onDeleteClick} modalId={`deletePostModal-${i+1}`} id={post._id} modalTitle='Delete Post and its Comments' modalBody='Are you sure you want to delete this Post? This cannot be undone.' /> */}
            
          </div>
        </div>

        {showActions ? (
          <span id="post-likes-wrapper">
            <span>
              <button
                onClick={this.onLikeClick.bind(this, post._id)}
                type="button"
                className="btn btn-light mr-1 post-feed--post-like-button__width"
              >
                <i
                  className={classnames('fas fa-thumbs-up fa-thumbs-general', {
                    'text-info': this.findUserLikes(post.likes)
                  })}
                />
                <span className="badge badge-light" id='post-like-counter'>{post.likes.length}</span>
              </button>
              <button
                onClick={this.onUnlikeClick.bind(this, post._id)}
                type="button"
                className="btn btn-light mr-1 post-feed--post-unlike-button__width-margin"
              >
                <i className="text-secondary fas fa-thumbs-down fa-thumbs-general" />
              </button>
            </span>
            <span className='post-feed--post-interaction-container__bottom'>
              <Link to={`/post/${post._id}`} className="btn btn-info post-feed--comments-link-button__width">
                Comments
              </Link>
            </span>
          </span>
          ) : null}
          
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteLike: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost, addLike, deleteLike }
)(PostItem);
