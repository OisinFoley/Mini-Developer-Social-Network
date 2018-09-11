import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import { getProfiles } from '../../actions/profileActions';

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profiles;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = <h1>profiles here</h1>;
      } else {
        profileItems = <h4>No profiles found ...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse developers and connect with them
              </p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profiles: state.profile,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
