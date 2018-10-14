import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profileActions';

class Experience extends Component {
  onDelete(id) {
    this.props.deleteExperience(id);
  }

  render() {
    const experience = this.props.experience.map(exp => (
      <tr className='row' key={exp._id}>
        <td className='col-3 table-item-xs'> {exp.company} </td>
        <td className='col-3 table-item-xs'> {exp.title} </td>
        <td className='col-3 table-item-xs'>
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> -&nbsp;
          {exp.to === null ? (
            'Now'
          ) : (
            <Moment format="DD/MM/YYYY">{exp.to}</Moment>
          )}
        </td>
        <td id='tableCellDeleteContainer'>
          <button
            onClick={this.onDelete.bind(this, exp._id)}
            className="btn-sm btn-danger deleteDashboardContent"
          >
            Delete
          </button>
        </td>
      </tr>
    ));

    return (
      <div>
        <h4 className="mb-4">Experience</h4>
        <table className="table">
          <thead>
            <tr className='row'>
              <th className="col-3 table-item-xs">Company</th>
              <th className="col-3 table-item-xs">Title</th>
              <th className="col-3 table-item-xs">Years</th>
            </tr>
          </thead>
          <tbody>{experience}</tbody>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
