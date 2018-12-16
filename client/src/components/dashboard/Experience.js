import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profileActions';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

class Experience extends Component {
  onDeleteExperience = id => {
    this.props.deleteExperience(id);
  }

  render() {
    const experience = this.props.experience.map((exp, i) => (
      <tr className='row' key={exp._id}>
        <td className='col-4 table-item-sm table-item-md'> {exp.company} </td>
        <td className='col-4 table-item-sm table-item-md'> {exp.title} </td>
        <td className='col-3 table-item-sm table-item-md'>
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> -&nbsp;
          {exp.to === null ? (
            'Now'
          ) : (
            <Moment format="DD/MM/YYYY">{exp.to}</Moment>
          )}
        </td>
        <td id='tableCellDeleteContainer'>
          <button
            data-toggle="modal"
            data-target={`#deleteExperienceModal-${i+1}`}
            className="btn-danger deleteDashboardContent"
          >
            <i id="delete-button-icon" class="fas fa-times"></i>
          </button>
          <ConfirmDeleteModal onDelete={this.onDeleteExperience} modalId={`deleteExperienceModal-${i+1}`} id={exp._id} modalTitle='Delete Experience' modalBody='Are you sure you want to delete this Experience? This cannot be undone.' />
        </td>
      </tr>
    ));

    return (
      <div className="dashboard-content-container bg-light">
        <h4 className="mb-4" className="dashboard-content-heading">Experience</h4>
        <table className="table" id="dashboard-content-table">
          <thead>
            <tr className='row'>
              <th className="col-4 table-item-sm table-item-md">Company</th>
              <th className="col-4 table-item-sm table-item-md">Title</th>
              <th className="col-3 table-item-sm table-item-md">Years</th>
              <th id="table-header-filler-item"></th>
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
