import React, { Component, FormEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { History, LocationState } from "history";

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import isEmpty from '../../validation/is-empty';
import BackButton from '../common/BackButton';
import { setProfile, getCurrentProfile } from '../../actions/profileActions';
import { ProfileInput, Profile, SelectElementOption } from 'devconnector-types/interfaces';
import { ErrorState } from '../../types/actionTypes';
import { SetProfileFormChangeEvent } from '../../types/htmlEventTypes';
import { SetProfileComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  profile: {
    profile: Profile
  };
  errors: ErrorState;
}

interface DispatchProps {
  setProfile: (setProfileData: ProfileInput, history: History<LocationState>) => void;
  getCurrentProfile: () => void;
}

interface OwnProps extends RouteComponentProps {
  path: string;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State extends ProfileInput {
  displaySocialInputs: boolean;
  errors: ErrorState;
  isEditProfilePath: boolean;
}

export class SetProfile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubUsername: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {},
      isEditProfilePath: this.props.path === '/edit-profile'
    };

  }

  componentDidMount() {
    if (this.props.path === '/edit-profile') {
      this.props.getCurrentProfile();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (Object.keys(nextProps.errors).length > 0) {
      return this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      // Convert skills array back to CSV
      const skillsCSV = profile.skills?.join(',');

      // If profile prop value doesn't exist, set as empty strings
      profile.company = profile.company || '';
      profile.website = profile.website || '';
      profile.location = profile.location || '';
      profile.githubUsername = profile.githubUsername || '';
      profile.bio = profile.bio || '';

      profile.social = !isEmpty(profile.social) ? profile.social : [{}];
      profile.twitter = profile.social[0].twitter || '';
      profile.facebook = profile.social[0].facebook || '';
      profile.linkedin = profile.social[0].linkedin || '';
      profile.youtube = profile.social[0].youtube || '';
      profile.instagram = profile.social[0].instagram || '';

      // Set component fields state
      this.setState({
        handle: profile.handle,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        githubUsername: profile.githubUsername,
        bio: profile.bio,
        twitter: profile.twitter,
        facebook: profile.facebook,
        linkedin: profile.linkedin,
        youtube: profile.youtube,
        instagram: profile.instagram
      });
    }
  }

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.state.status === '0') {
      return this.setState({
        errors: {
          status: 'Select a value from this dropdown.'
        }
      });
    }

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubUsername: this.state.githubUsername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    };

    this.props.setProfile(profileData, this.props.history);
  }
  
  onChange = (e: SetProfileFormChangeEvent) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  render() {
    const { errors, displaySocialInputs, isEditProfilePath } = this.state;
    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />

          <InputGroup
            placeholder="Facebook Page URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />

          <InputGroup
            placeholder="Linkedin Profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />

          <InputGroup
            placeholder="YouTube Channel URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />

          <InputGroup
            placeholder="Instagram Page URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }

    // Select options for status
    const options: Array<SelectElementOption> = [
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Architect', value: 'Architect' },
      { label: 'Student or Learning', value: 'Student or Learning' },
      { label: 'Instructor / Teacher', value: 'Instructor / Teacher' },
      { label: 'Intern / Work Placement', value: 'Intern' },
      { label: 'UX Designer', value: 'UX Designer' },
      { label: 'QA / Tester', value: 'QA / Tester' },
      { label: 'Agile Coach', value: 'Agile Coach' },
      { label: 'Other (Non-affiliated)', value: 'Other' }
    ];

    if (this.props.path !== '/edit-profile') {
      options.unshift({ label: '- Select Professional Status -', value: 0 });
    }

    return (
      <div className="set-profile">
        <div className="md-container">
          <div className="row">
            <div className="col-md-12">
            {
              isEditProfilePath
              ?
                <div>
                  <BackButton route='dashboard' />
                  <h1 className="text-center">Edit Profile</h1>
                </div>
              :
                <div>
                  <h1 className="text-center">Create Profile</h1>
                </div>
            }
              <p className="lead text-center">
                Provide info to make your profile stand out
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <div className="bg-light form-generic__container">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* Profile Handle"
                    name="handle"
                    value={this.state.handle}
                    onChange={this.onChange}
                    error={errors.handle}
                    info="A unique handle for your profile URL. Your full name, company name, nickname"
                  />
                  <SelectListGroup
                    name="status"
                    value={this.state.status}
                    onChange={this.onChange}
                    options={options}
                    error={errors.status}
                    info="Give us an idea of where you are in your career"
                  />
                  <TextFieldGroup
                    placeholder="Company"
                    name="company"
                    value={this.state.company}
                    onChange={this.onChange}
                    error={errors.company}
                    info="Your employer or your own company"
                  />
                  <TextFieldGroup
                    placeholder="Website"
                    name="website"
                    value={this.state.website}
                    onChange={this.onChange}
                    error={errors.website}
                    info="Your own website or your employer's"
                  />
                  <TextFieldGroup
                    placeholder="Location"
                    name="location"
                    value={this.state.location}
                    onChange={this.onChange}
                    error={errors.location}
                    info="City and/or State where you work or reside"
                  />
                  <TextFieldGroup
                    placeholder="* Skills"
                    name="skills"
                    value={this.state.skills}
                    onChange={this.onChange}
                    error={errors.skills}
                    info="Please use comma separated values (e.g. JavaScript, C#, CSS)"
                  />
                  <TextFieldGroup
                    placeholder="Github Username"
                    name="githubUsername"
                    value={this.state.githubUsername}
                    onChange={this.onChange}
                    error={errors.githubUsername}
                    info="To show your latest Github repos, include your username - name only, not URL"
                  />
                  <TextAreaFieldGroup
                    placeholder="Short Bio"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.onChange}
                    error={errors.bio}
                    info="Tell us a little about yourself"
                  />

                  <div className="mb-3 set-profile__optional-btn">
                    <button
                      type="button"
                      onClick={() => {
                        this.setState(prevState => ({
                          displaySocialInputs: !prevState.displaySocialInputs
                        }));
                      }}
                      className="btn btn-light"
                    >
                      Add Social Network Links
                    </button>
                    <span className="text-muted set-profile__span--optional-label">Optional</span>
                  </div>
                  {socialInputs}
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

const mapStateToProps = (state: SetProfileComponentState): StateProps => ({
  profile: state.profile,
  errors: state.errors
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { setProfile, getCurrentProfile }
)(withRouter(SetProfile));