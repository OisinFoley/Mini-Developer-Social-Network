import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileActionLinks from './ProfileActionLinks';
import Experiences from './Experiences';
import Educations from './Educations';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import { AuthState, ProfileState } from '../../types/actionTypes';
import { DashboardComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';
import { emptyProfile } from '../../utils/empty-object-states';

interface DispatchProps {
  getCurrentProfile: () => void;
  deleteAccount: () => void;
}

interface StateProps {
  auth: AuthState;
  profile: ProfileState;
}

type Props = StateProps & DispatchProps;

export class Dashboard extends Component<Props> {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteProfileClick = () => {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const hasExistingProfile = JSON.stringify(profile) !== JSON.stringify(emptyProfile);

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (hasExistingProfile) {
        dashboardContent = (
          <div className="dashboard__container">
            <p className="lead text-muted dashboard__welcome-label">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActionLinks />
            <Experiences experience={profile.experience} />
            <Educations education={profile.education} />
            <hr className="delete-account__hr"/>
            <button
              className="btn btn-danger btn--margin dashboard__delete-account-btn"
              data-toggle="modal"
              data-target={`#deleteProfileModal`}
            >
              Delete my Account
            </button>
          <ConfirmDeleteModal
            onDelete={this.onDeleteProfileClick}
            modalId={`deleteProfileModal`}
            tabIndex={0}
            modalTitle='Delete Profile'
            modalBody="Are you sure you want to delete your entire Profile? This cannot be undone. Your posts will remain after your profile is removed.."
          />
          </div>
        );
      } else {
        // logged in but no profile created
        dashboardContent = (
          <div>
            <p className="lead text-muted dashboard__welcome-label"> Welcome {user.name} </p>
            <p>No profiles have been setup yet, add some info.</p>
            <Link to="/create-profile" className="btn btn-info" id='dashboard__create-profile-btn'>
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard .md-container">
          <div className="row">
            <div className="offset-md-1 col-md-10">
              <h1 className="dashboard__heading">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state: DashboardComponentState): StateProps => ({
  profile: state.profile,
  auth: state.auth
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
