import React, { Component, FormEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { History, LocationState } from "history";

import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import { LoginInput } from 'devconnector-types/interfaces';
import { ErrorState, AuthState } from '../../types/actionTypes';
import { LoginComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  auth: AuthState;
  errors: ErrorState;
}

interface DispatchProps {
  loginUser: (loginData: LoginInput) => void;
}

interface OwnProps {
  history: History<LocationState>;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State extends LoginInput {
  errors: ErrorState;
}

export class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {}
    };

  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(loginData);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
                <br />
              </p>
              <div className="bg-light form-generic__container">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Email Address"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />

                  <TextFieldGroup
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />

                  <input type="submit" className="btn btn-info btn-block mt-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: LoginComponentState): StateProps => ({
  auth: state.auth,
  errors: state.errors
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  { loginUser }
)(Login);
