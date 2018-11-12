import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/postActions';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

class CommentItem extends Component {
  onDeleteClick = (postId, commentId) => {
    this.props.deleteComment(postId, commentId);
  }
  render() {
    const { comment, i, postId, auth } = this.props;

    return (
      <div className="card card-body mb-3 comment-feed--individual-comment-container__padding">
        <div className="row">
          <div className="col-3 col-md-3 col-lg-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-block"
                src={comment.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center" id='users-profile-name'>{comment.name}</p>
          </div>
          <div className="col-md-9 col-lg-10 col-9" id='post-content-body'>
            {comment.user === auth.user.id ? (
              <button
                type="button"
                className="btn btn-danger mr-1 post-feed--delete-comment-button__float"
                data-toggle="modal"
                data-target={`#deleteCommentModal-${i+1}`}
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
          <ConfirmDeleteModal onDelete={this.onDeleteClick} modalId={`deleteCommentModal-${i+1}`} id={postId} nestedId={comment._id} modalTitle='Delete Comment' modalBody='Are you sure you want to delete this Comment? This cannot be undone.' />
          <p className="lead post-feed--post-text-__width">{comment.text}</p>
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
