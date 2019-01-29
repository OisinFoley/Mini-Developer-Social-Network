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
      <div className="card card-body mb-3 bg-light comment-feed--individual-comment-container__padding">
        <div className="row">
          <span className="col-12">
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
            <img src={comment.avatar} alt="Profile No Longer Exists" className="img rounded-circle img--alt-font col-2" />
            <div id="profile-short-details-text">
              <p id="posters-profile-name">{comment.name}</p>
            </div>
            <p className="lead post-feed--post-text-__width">{comment.text}</p>
          </span>
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
