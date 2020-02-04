import React, { Component, FormEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { History, LocationState } from "history";

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addExperience } from '../../actions/profileActions';
import BackButton from '../common/BackButton';
import { ExperienceInput } from 'devconnector-types/interfaces';
import { AddExperienceComponentState } from '../../types/stateTypes';
import { ErrorState, ProfileState } from '../../types/actionTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  profile: ProfileState;
  errors: ErrorState;
}

interface DispatchProps {
  addExperience: (expData: ExperienceInput, history: History<LocationState>) => void;
}

interface OwnProps {
  history: History<LocationState>;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State extends ExperienceInput {
  errors: ErrorState;
  disabled: boolean;
}

export class AddExperience extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      company: '',
      title: '',
      location: '',
      from: new Date(),
      to: new Date(),
      current: false,
      description: '',
      errors: {},
      disabled: false
    };

  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const expData = {
      company: this.state.company,
      title: this.state.title,
      location: this.state.location,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description
    };

    this.props.addExperience(expData, this.props.history);
  }

  onChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  onCheck = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="add-experience">
        <div className="md-container">
          <div className="row">
            <div className="col-md-12">
              <BackButton route='dashboard' />
              <h1 className="text-center">Add Experience</h1>
              <p className="lead text-center">
                Add a job or position you currently work at or have in the past
              </p>
              <small className="d-block pb-3">* Required fields </small>
              <div className="bg-light form-generic__container">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* Company"
                    name="company"
                    value={this.state.company}
                    onChange={this.onChange}
                    error={errors.company}
                  />
                  <TextFieldGroup
                    placeholder="* Job Title"
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                    error={errors.title}
                  />
                  <TextFieldGroup
                    placeholder="Location"
                    name="location"
                    value={this.state.location}
                    onChange={this.onChange}
                  />
                  <h6> Start Date </h6>
                  <TextFieldGroup
                    placeholder="mm/dd/yyy"
                    type="date"
                    name="from"
                    value={this.state.from}
                    onChange={this.onChange}
                    error={errors.from}
                  />
                  <h6> End Date </h6>
                  <TextFieldGroup
                    placeholder="mm/dd/yyy"
                    type="date"
                    name="to"
                    value={this.state.to}
                    onChange={this.onChange}
                    disabled={this.state.disabled ? true : false}
                  />
                  <div className="form-check mb-4">
                    <input
                      type="checkbox"
                      name="current"
                      className="form-check-input"
                      value={this.state.current.toString()}
                      checked={this.state.current}
                      onChange={this.onCheck}
                      id="current"
                    />
                    <label htmlFor="current" className="form-check-label">
                      Current Job
                    </label>
                  </div>
                  <TextAreaFieldGroup
                    placeholder="Job Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                    info="Tell us a little about the position"
                  />
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AddExperienceComponentState): StateProps => ({
  profile: state.profile,
  errors: state.errors
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  { addExperience }
)(AddExperience);
