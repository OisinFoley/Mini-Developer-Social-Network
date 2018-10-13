import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {
  onDelete(id) {
    this.props.deleteEducation(id);
  }

  render() {
    const education = this.props.education.map(edu => (
      <tr className='row' key={edu._id}>
        <td className='col-3'> {edu.school} </td>
        <td className='col-3'> {edu.degree} </td>
        <td className='col-3'>
          <Moment format="DD/MM/YYYY">{edu.from}</Moment> -&nbsp;
          {edu.to === null ? (
            'Now'
          ) : (
            <Moment format="DD/MM/YYYY">{edu.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDelete.bind(this, edu._id)}
            className="btn btn-danger"
          >
            {' '}
            Delete{' '}
          </button>
        </td>
      </tr>
    ));

    return (
      <div>
        <h4 className="mb-4">Education</h4>
        <table className="table">
          <thead>
            <tr className='row'>
              <th className="col-3">School</th>
              <th className="col-3">Degree</th>
              <th className="col-3">Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{education}</tbody>
        </table>
      </div>
    );
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
