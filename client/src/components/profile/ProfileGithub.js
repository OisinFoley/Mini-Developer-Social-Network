import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '07edafc775ba82f94674',
      clientSecret: '25d3d684775dbe11797c5ad29377fcdb47e4ad75',
      count: 5,
      sort: 'created: asc',
      repos: []
    };
  }

  componentDidMount() {
    const { username } = this.props;
    const { clientId, clientSecret, count, sort } = this.state;
    console.log('test log');

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then(res => {
        console.log(res);
        res.json()
      })
      .then(data => {
        if (this.refs.myRef) {
          this.setState({ repos: data });
        }
      })
      .catch(err => this.setState({ repos: null }));
  }

  render() {
    const { repos } = this.state;
    let repoItems;
    if (repos.length === 0 || repos.message) {
      repoItems = (
        <div>
          No repos to display for this username - check the username you've
          specified in <b>Edit Profile</b> or that your Github account is
          populated with repos.
        </div>
      );
    } else {
      repoItems = repos.map(repo => (
        <div key={repo.id} className="card card-body mb-2">
          <div className="row">
            <div className="col-md-6">
              <h4>
                <a href={repo.html_url} target="_blank" className="text-info">
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div className="col-md-6">
              <span className="badge badge-info mr-1">
                Stars: {repo.stargazers_count}
              </span>
              <span className="badge badge-secondary mr-1">
                Watchers: {repo.watchers_count}
              </span>
              <span className="badge badge-success">
                Forks: {repo.forks_count}
              </span>
            </div>
          </div>
        </div>
      ));
    }

    return (
      <div ref="myRef" id="profile-github__info-container">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileGithub;
