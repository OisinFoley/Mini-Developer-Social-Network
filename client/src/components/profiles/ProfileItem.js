import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/is-empty';
import PropTypes from 'prop-types';

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          {/* <div className="col-4 offset-4 col-lg-2 offset-md-0 offset-lg-0 profileImageContainer"> */}
          <div className="col-3 col-md-3 col-lg-2 ">
          
            <img src={profile.user.avatar} alt="" className="rounded-circle profilePhoto" />
            <br/>
            <br/>
            {/* <h3>{profile.user.name}</h3> */}
            <p class="text-center" id="users-profile-name">{profile.user.name}</p>
            <hr/>
            <p className='profileCurrentPosition'>
              {profile.status}{' '}
              {isEmpty(profile.company) ? null : (
                <span> at {profile.company} </span>
              )}
            </p>
            <p className='profileLocation'>
              {isEmpty(profile.location) ? null : (
                <span>{profile.location}</span>
              )}
            </p>
          </div>
          {/* <div className="mainProfileInfoContainer col-6 col-lg-6 col-md-4">
            <h3>{profile.user.name}</h3>
            <p className='profileCurrentPosition'>
              {profile.status}{' '}
              {isEmpty(profile.company) ? null : (
                <span> at {profile.company} </span>
              )}
            </p>
            <p className='profileLocation'>
              {isEmpty(profile.location) ? null : (
                <span>{profile.location}</span>
              )}
            </p>
            <Link to={`/profile/${profile.handle}`} className="btn btn-info">
              View Profile
            </Link>
          </div> */}

          {/* <div className="col-6 col-md-10 d-md-block" id="profile-item-skillset-padding"> */}
          <div className="col-md-9 col-lg-10 col-9" id="profile-item-skillset-padding">
            <h4 className='headingSkillSet'>Skill set</h4>
            <ul className="list-group">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" /> {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span className='post-feed--post-interaction-container__bottom'>
          <button
            type="button"
            className="btn btn-light mr-1 post-feed--post-like-button__width"
            id="hide-like-btn"
          >
            <i className='fas fa-thumbs-up fa-thumbs-general' />
            <span className="badge badge-light" id='post-like-counter'></span>
          </button>
          <button
            type="button"
            className="btn btn-light mr-1 post-feed--post-unlike-button__width-margin"
            id="hide-like-btn"
          >
            <i className="text-secondary fas fa-thumbs-down fa-thumbs-general" />
          </button>
          <Link to={`/profile/${profile.handle}`} className="btn btn-info offset-2 post-feed--comments-link-button__width">
            View Profile
          </Link>
        </span>
      </div>
    );
  }
}

ProfileItem.proptypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
