import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import isEmpty from '../../validation/is-empty';
import { Profile } from 'devconnector-types/interfaces';

interface OwnProps {
  profile: Profile;
}

type Props = OwnProps;

export class ProfileItem extends Component<Props> {
  render() {
    const { profile } = this.props;
    
    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <span className="col-12">
            <img src={profile.user.avatar} alt="" className="img rounded-circle col-2 img--alt-font" />
            <div id="feed-generic__users-basic-details">
              <p id="profiles-feed__users-profile-name">{profile.user.name}</p>
              <p className='profiles-feed__current-position'>
                  {profile.status}{' '}
                  {isEmpty(profile.company) ? null : (
                    <span>at {profile.company}</span>
                  )}
              </p>
              <p className='profiles-feed__current-location'>
                {isEmpty(profile.location) ? null : (
                  <span>{profile.location}</span>
                )}
              </p>
            </div>
          </span>

          <h4 className='profile-item__heading-skillset text-center'>Skill set</h4>
          <div className="col-10 offset-1 profile-item__skillset">
            <ul className="list-group">
              {profile.skills.slice(0, 6).map((skill: string, index: number) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" /> {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span className='posts-profiles-feed__feed-item-link-span'>
          <Link to={`/profile/${profile.handle}`} className="btn btn-info posts-profiles-feed__feed-item-link">
            View Full Profile
          </Link>
        </span>
      </div>
    );
  }
}

export default ProfileItem;
