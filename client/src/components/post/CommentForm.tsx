import React, { Component, FormEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addComment } from '../../actions/postActions';
import { User, CommentInput } from 'devconnector-types/interfaces';
import { AuthState, ErrorState } from '../../types/actionTypes';
import { CommentFormComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  auth: AuthState;
  errors: ErrorState;
}

interface DispatchProps {
  addComment: (postId: string, newCommentData: CommentInput) => void;
}

interface OwnProps {
  postId: string;
}

interface State {
  text: string;
  errors: ErrorState;
}

type Props = StateProps & DispatchProps & OwnProps;

export class CommentForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      text: '',
      errors: {}
    };

  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { user }: { user: User} = this.props.auth;
    const { postId } = this.props;

    const newCommentData: CommentInput = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    };

    this.props.addComment(postId, newCommentData);
    this.setState({ text: '' });
  }

  onChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Write a comment</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Comment Text"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <button type="submit" className="btn btn-dark posts-comments__submit-button">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: CommentFormComponentState): StateProps => ({
  auth: state.auth,
  errors: state.errors
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { addComment }
)(CommentForm);