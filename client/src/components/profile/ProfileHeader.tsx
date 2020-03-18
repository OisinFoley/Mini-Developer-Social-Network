import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';
import { Profile } from 'devconnector-types/interfaces';

interface OwnProps {
  profile: Profile;
}

type Props = OwnProps;

class ProfileHeader extends Component<Props> {
  render() {
    const { profile } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-6 col-sm-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={profile.user.avatar}
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-center profile-header__title">{profile.user.name}</h1>
              <p className="lead text-center">
                {profile.status}
                {isEmpty(profile.company) ? null : (
                  <span> at {profile.company}</span>
                )}
              </p>
              {isEmpty(profile.location) ? null : <p>{profile.location}</p>}
              <p>
                {isEmpty(profile.website) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-globe fa-2x" />
                  </a>
                )}

                {isEmpty(profile.social && profile.social[0].twitter) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social[0].twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile.social && profile.social[0].linkedin
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social[0].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile.social && profile.social[0].instagram
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social[0].instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile.social && profile.social[0].facebook
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social[0].facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook fa-2x" />
                  </a>
                )}

                {isEmpty(profile.social && profile.social[0].youtube) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social[0].youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-youtube fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
