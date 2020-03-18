import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deleteComment } from '../../actions/postActions';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import { Comment } from 'devconnector-types/interfaces';
import { AuthState } from '../../types/actionTypes';
import { CommentItemComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  auth: AuthState;
}

interface DispatchProps {
  deleteComment: (postId: string, commentId: string) => void;
}

interface OwnProps {
  key: string;
  i: number;
  comment: Comment;
  postId: string;
}

type Props = StateProps & DispatchProps & OwnProps;

export class CommentItem extends Component<Props> {
  onDeleteClick = (postId: string, commentId: string) => {
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
                className="btn btn-danger mr-1 posts-comments-feed__delete-item-button"
                data-toggle="modal"
                data-target={`#deleteCommentModal-${+i + 1}`}
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
            <ConfirmDeleteModal
              tabIndex={+i}
              onDelete={this.onDeleteClick}
              modalId={`deleteCommentModal-${+i + 1}`}
              resourceId={postId}
              subResourceId={comment._id}
              modalTitle='Delete Comment'
              modalBody='Are you sure you want to delete this Comment? This cannot be undone.' />
            <img
              src={comment.avatar}
              alt="Profile No Longer Exists"
              className="img rounded-circle img--alt-font col-2" />
            <div id="feed-generic__users-basic-details">
              <p id="feed-generic__users-profile-name">{comment.name}</p>
            </div>
            <p className="lead posts-comments-feed__feed-item-content-text">{comment.text}</p>
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: CommentItemComponentState): StateProps => ({
  auth: state.auth
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
