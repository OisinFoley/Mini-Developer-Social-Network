import React, { Component, FormEvent, ChangeEvent } from 'react';
import { History, LocationState } from "history";
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addEducation } from '../../actions/profileActions';
import BackButton from '../common/BackButton';
import { EducationInput } from 'devconnector-types/interfaces';
import { AddEducationComponentState } from '../../types/stateTypes';
import { ErrorState, ProfileState } from '../../types/actionTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  profile: ProfileState;
  errors: ErrorState;
}

interface DispatchProps {
  addEducation: (eduData: EducationInput, history: History<LocationState>) => void;
}

interface OwnProps {
  history: History<LocationState>;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State extends EducationInput {
  current: boolean;
  description: string;
  errors: ErrorState;
  disabled: boolean;
}

export class AddEducation extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      school: '',
      degree: '',
      fieldOfStudy: '',
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

  onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const eduData = {
      school: this.state.school,
      degree: this.state.degree,
      fieldOfStudy: this.state.fieldOfStudy,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description
    };

    this.props.addEducation(eduData, this.props.history);
  }

  onChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ): void => {
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
      <div className="add-education">
        <div className="md-container">
          <div className="row">
            <div className="col-md-12">
              <BackButton route='dashboard' />
              <h1 className="text-center">Add Education</h1>
              <p className="lead text-center">
                Add academic education or coding training you've attended
              </p>
              <small className="d-block pb-3">* Required fields </small>
              <div className="bg-light form-generic__container">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* School"
                    name="school"
                    value={this.state.school}
                    onChange={this.onChange}
                    error={errors.school}
                  />
                  <TextFieldGroup
                    placeholder="* Degree or Learning Certification"
                    name="degree"
                    value={this.state.degree}
                    onChange={this.onChange}
                    error={errors.degree}
                  />
                  <TextFieldGroup
                    placeholder="* Field of Study"
                    name="fieldOfStudy"
                    value={this.state.fieldOfStudy}
                    onChange={this.onChange}
                    error={errors.fieldOfStudy}
                  />
                  <h6> From Date </h6>
                  <TextFieldGroup
                    placeholder="mm/dd/yyy"
                    type="date"
                    name="from"
                    value={this.state.from}
                    onChange={this.onChange}
                    error={errors.from}
                  />
                  <h6> To Date </h6>
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
                      Ongoing Study
                    </label>
                  </div>
                  <TextAreaFieldGroup
                    placeholder="Program Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                    info="Tell us about the program you were in when studying"
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

const mapStateToProps = (state: AddEducationComponentState) => ({
  profile: state.profile,
  errors: state.errors
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  { addEducation }
)(AddEducation);
