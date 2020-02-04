import React, { Component, FormEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { History, LocationState } from "history";

import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import { RegisterInput } from 'devconnector-types/interfaces';
import { RegisterComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';
import { AuthState, ErrorState } from '../../types/actionTypes';

interface StateProps {
  auth: AuthState;
  errors: ErrorState;
}

interface DispatchProps {
  registerUser: (newUser: RegisterInput, history: History<LocationState>) => void;
}

interface OwnProps {
  history: History<LocationState>;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  name: string;
  email: string;
  password: string;
  password2: string;
  errors: ErrorState;
}

export class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };

  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const stateUpdates: any = { [e.target.name]: e.target.value };

    this.setState(stateUpdates);
  }

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <div className="bg-light form-generic__container">
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                  />

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

                  <TextFieldGroup
                    placeholder="Verify password"
                    name="password2"
                    type="password"
                    value={this.state.password2}
                    onChange={this.onChange}
                    error={errors.password2}
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

const mapStateToProps = (state: RegisterComponentState): StateProps => ({
  auth: state.auth,
  errors: state.errors
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  { registerUser }
)(Register);
