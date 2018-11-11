import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

class Education extends Component {
  onDeleteEducation = id => {
    this.props.deleteEducation(id);
  }

  render() {
    const education = this.props.education.map((edu, i) => (
      <tr className='row' key={edu._id}>
        <td className='col-3 table-item-xs'> {edu.school} </td>
        <td className='col-3 table-item-xs'> {edu.degree} </td>
        <td className='col-3 table-item-xs'>
          <Moment format="DD/MM/YYYY">{edu.from}</Moment> -&nbsp;
          {edu.to === null ? (
            'Now'
          ) : (
            <Moment format="DD/MM/YYYY">{edu.to}</Moment>
          )}
        </td>
        <td id='tableCellDeleteContainer'>
          <button
            data-toggle="modal"
            data-target={`#deleteEducationModal-${i+1}`}
            className="btn-sm btn-danger deleteDashboardContent"
          >
            Delete
          </button>
          <ConfirmDeleteModal onDelete={this.onDeleteEducation} modalId={`deleteEducationModal-${i+1}`} id={edu._id} modalTitle='Delete Education' modalBody='Are you sure you want to delete this Education? This cannot be undone.' />
        </td>
      </tr>
    ));

    return (
      <div>
        <h4 className="mb-4">Education</h4>
        <table className="table">
          <thead>
            <tr className='row'>
              <th className="col-3 table-item-xs">School</th>
              <th className="col-3 table-item-xs">Degree</th>
              <th className="col-3 table-item-xs">Years</th>
            </tr>
          </thead>
          <tbody>{education}</tbody>
        </table>
        <hr className='delete-account-hr' />
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
