import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

export class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteProfileClick = () => {
    console.log('ondeleteprofilecliockcalled');
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div className="dashboard__container">
            <p className="lead text-muted dashboard__welcome-label">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <hr/>
            <button
              className="btn btn-danger btn--margin dashboard__delete-account-btn"
              data-toggle="modal"
              data-target={`#delete-profile-modal-confirm-btn`}
            >
              Delete my Account
            </button>
          <ConfirmDeleteModal onDelete={this.onDeleteProfileClick} modalId={`deleteProfileModal`} id={'delete-profile-modal-confirm-btn'} nestedId={null} modalTitle='Delete Profile' modalBody="Are you sure you want to delete your entire Profile? This cannot be undone. Your posts will remain after your profile is removed.." />
          </div>
        );
      } else {
        // logged in but no profile
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

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
