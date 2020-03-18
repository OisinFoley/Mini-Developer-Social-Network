import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';

import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import ProfileGithub from './ProfileGithub';
import ProfileHeader from './ProfileHeader';
import Spinner from '../common/Spinner';
import BackButton from '../common/BackButton';
import { getProfileByHandle } from '../../actions/profileActions';
import { Profile as ProfileAbstraction } from 'devconnector-types/interfaces';
import { ProfileComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  profile: {
    profile: ProfileAbstraction,
    loading: boolean,
  };
}

interface DispatchProps {
  getProfileByHandle: (handle: string) => void;
}

interface MatchParams {
  handle: string;
}

interface OwnProps extends RouteChildrenProps<MatchParams> {}

type Props = StateProps & DispatchProps & OwnProps;

export class Profile extends Component<Props> {
  componentDidMount() {
    if (this.props.match?.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.profile.profile === null && this.props.profile.loading) {
      this.props.history.push('/not-found');
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div className="profile__container-wrapper">
          <div className="row">
            <div className="col-md-6">
              <BackButton route='dashboard' additionalClasses='mb-3 float-left' />
            </div>
            <div className="col-md-6" />
          </div>
          <ProfileHeader profile={profile} />
          <ProfileAbout profile={profile} />
          <ProfileCreds
            education={profile.education}
            experience={profile.experience}
          />
          {profile.githubUsername ? (
            <ProfileGithub username={profile.githubUsername} />
          ) : null}
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="md-container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ProfileComponentState): StateProps => ({
  profile: state.profile
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
