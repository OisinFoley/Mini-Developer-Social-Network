import React, { Component, FormEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost } from '../../actions/postActions';
import { PostInput } from 'devconnector-types/interfaces';
import { AuthState, ErrorState } from '../../types/actionTypes';
import { PostFormComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  auth: AuthState;
  errors: ErrorState;
}

interface DispatchProps {
  addPost: (newPost: PostInput) => void;
}

interface State {
  text: string;
  errors: ErrorState;
}

type Props = StateProps & DispatchProps;

interface testInterface {
  name: string[];
  value: string;
}

export class PostForm extends Component<Props, State> {
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

    const { user } = this.props.auth;

    const newPost = {
      text: this.state.text,
      name: user.name,
      user: user.id,
      avatar: user.avatar
    };

    this.props.addPost(newPost);
    this.setState({
      text: ''
    });
  }

  onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Write a post</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Post Text"
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

const mapStateToProps = (state: PostFormComponentState): StateProps => ({
  auth: state.auth,
  errors: state.errors
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { addPost }
)(PostForm);
