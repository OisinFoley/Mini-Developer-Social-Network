import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { deletePost, addLike, deleteLike } from '../../actions/postActions';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import { Like, Post } from 'devconnector-types/interfaces';
import { AuthState } from '../../types/actionTypes';
import { PostItemComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  auth: AuthState;
}

interface DispatchProps {
  deletePost: (id: string) => void;
  addLike: (id: string) => void;
  deleteLike: (id: string) => void;
}

interface OwnProps {
  post: Post;
  i?: number;
  showActions: boolean;
}

type Props = StateProps & DispatchProps & OwnProps;

export class PostItem extends Component<Props> {

  public static defaultProps = {
    showActions: true
  };

  onDeleteClick = (id: string) => {
    this.props.deletePost(id);
  }

  onLikeClick = (id: string) => {
    this.props.addLike(id);
  }

  onUnlikeClick = (id: string) => {
    this.props.deleteLike(id);
  }

  findUserLikes = (likes: Like[]) => {
    const { auth } = this.props;

    if (likes.filter((like: Like) => like.user === auth.user.id).length > 0) {
      return true;
    }
    return false;
  }

  render() {
    const { i = 0, post, auth, showActions } = this.props;
    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <span className="col-12">
            {post.user === auth.user.id ? (
              <button
                type="button"
                className="btn btn-danger mr-1 posts-comments-feed__delete-item-button"
                data-toggle="modal"
                data-target={`#deletePostModal-${+i + 1}`}
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
            <ConfirmDeleteModal
              onDelete={this.onDeleteClick}
              modalId={`deletePostModal-${+i + 1}`}
              resourceId={post._id}
              modalTitle='Delete Post and its Comments'
              modalBody='Are you sure you want to delete this Post? This cannot be undone.' />
            <img src={post.avatar} alt="Profile No Longer Exists" className="img rounded-circle img--alt-font col-2" />
            <div id="feed-generic__users-basic-details">
              <p id="feed-generic__users-profile-name">{post.name}</p>
              <span>
                <button
                  onClick={this.onLikeClick.bind(this, post._id)}
                  type="button"
                  className="btn btn-light mr-1 posts-comments-feed__like-btn"
                >
                  <i
                    className={classnames('fas fa-thumbs-up fa-thumbs-general', {
                      'text-info': this.findUserLikes(post.likes)
                    })}
                  />
                  <span className="badge badge-light" id='posts-feed__likes-count'>{post.likes.length}</span>
                </button>
                <button
                  onClick={this.onUnlikeClick.bind(this, post._id)}
                  type="button"
                  className="btn btn-light mr-1 posts-comments-feed__unlike-btn"
                >
                  <i className="text-secondary fas fa-thumbs-down fa-thumbs-general" />
                </button>
              </span>
            </div>
            <p className="lead posts-comments-feed__feed-item-content-text">{post.text}</p>
          </span>
        </div>

        {showActions ? (
          <div id="posts-feed__feed-item-link-wrapper">
            <span className='posts-profiles-feed__feed-item-link-span'>
              <Link to={`/post/${post._id}`} className="btn btn-info posts-profiles-feed__feed-item-link">
                Comments
              </Link>
            </span>
          </div>
          ) : null}

      </div>
    );
  }
}

const mapStateToProps = (state: PostItemComponentState): StateProps => ({
  auth: state.auth
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { deletePost, addLike, deleteLike }
)(PostItem);
