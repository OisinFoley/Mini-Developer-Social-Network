import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';
import { Profile } from 'devconnector-types/interfaces';
import { ProfilesComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  profile: {
    profiles: Profile[];
    loading: boolean;
  };
}

interface DispatchProps {
  getProfiles: () => void;
}

type Props = StateProps & DispatchProps;

export class Profiles extends Component<Props> {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map((profile: Profile) => (
          <ProfileItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found ...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="md-container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse developers and interact through posts and comments
              </p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ProfilesComponentState): StateProps => ({
  profile: state.profile
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { getProfiles }
)(Profiles);
