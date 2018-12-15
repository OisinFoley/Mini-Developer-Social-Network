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

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteProfileClick = () => {
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
          <div className="dashboard-content">
            <p className="lead text-muted dashboardWelcomeLabel">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <hr/>
            <button
              className="btn btn-danger btn-margin-spacing btnDeleteAccount"
              data-toggle="modal"
              data-target={`#deleteProfileModal`}
            >
              Delete my Account
            </button>
          <ConfirmDeleteModal onDelete={this.onDeleteProfileClick} modalId={`deleteProfileModal`} id={null} nestedId={null} modalTitle='Delete Profile' modalBody="Are you sure you want to delete your entire Profile? This cannot be undone. Your posts will remain after your profile is removed.." />
          </div>
        );
      } else {
        // logged in but no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted dashboardWelcomeLabel"> Welcome {user.name} </p>
            <p>No profiles have been setup yet, add some info.</p>
            <Link to="/create-profile" className="btn btn-info" id='create-profile-button'>
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
          <div className="row">
            <div className="col-md-12">
              <h1 className="dashboard-heading">Dashboard</h1>
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
