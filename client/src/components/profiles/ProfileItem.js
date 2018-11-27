import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/is-empty';
import PropTypes from 'prop-types';

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
      {/* <p>
        don't use this layout <br/> 
        the layout we want is the following: <br/>
        3 rows. <br/>
        1st row: img in one col, then another col w/ user's name and under that their position, if it looks good then in a 3rd col show their location <br/>
        2nd row: the skillset table
        3rd row: link to full profile
      </p> */}
        <div className="row">
          <span className="col-12">
            <img style={{float: "left"}} src={profile.user.avatar} alt="" className="rounded-circle profilePhoto col-2" />
            <div id="profile-short-details-text">
              <p id="users-profile-name">{profile.user.name}</p>
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
          </span>
          
          <h4 className='headingSkillSet text-center' style={{width: 100 + "%"}}>Skill set</h4>
          <div className="col-10 offset-1" id="profile-item-skillset-padding" style={{padding: 0, maxHeight: 150 + "px", overflowY: "scroll"}}>
            <ul className="list-group">
              {profile.skills.slice(0, 6).map((skill, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" /> {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span className='post-feed--post-interaction-container__bottom'>
          <Link to={`/profile/${profile.handle}`} className="btn btn-info post-feed--comments-link-button__width">
            View Full Profile
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
