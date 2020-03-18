import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { deleteEducation } from '../../actions/profileActions';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import { Education } from 'devconnector-types/interfaces';

interface DispatchProps {
  deleteEducation: (id: string) => void;
}

interface OwnProps {
  education: Education[];
}

type Props = DispatchProps & OwnProps;

export class Educations extends Component<Props, {}> {
  onDeleteEducation = (id: string) => {
    this.props.deleteEducation(id);
  }

  render() {
    const education = this.props.education.map((edu: Education, i: number) => (
      <tr className='row' key={edu._id}>
        <td className='col-4 table-item--sm table-item-md'>{edu.school}</td>
        <td className='col-4 table-item--sm table-item-md'>{edu.degree}</td>
        <td className='col-3 table-item--sm table-item-md'>
          <Moment format="DD/MM/YYYY">{edu.from}</Moment> -&nbsp;
          {edu.to === null ? (
            'Now'
          ) : (
            <Moment format="DD/MM/YYYY">{edu.to}</Moment>
          )}
        </td>
        <td id='dashboard__delete-button'>
          <button
            data-toggle="modal"
            data-target={`#deleteEducationModal-${+i + 1}`}
            className="btn-danger dashboard__btn-delete"
            id={`delete-education-btn-${i}`}
          >
            <i id="delete-button-icon" className="fas fa-times"></i>
          </button>
          <ConfirmDeleteModal
            onDelete={this.onDeleteEducation}
            modalId={`deleteEducationModal-${+i + 1}`}
            tabIndex={+i}
            resourceId={edu._id}
            modalTitle='Delete Education'
            modalBody='Are you sure you want to delete this Education? This cannot be undone.' />
        </td>
      </tr>
    ));

    return (
      <div className="dashboard__content-container bg-light">
        <h4 className="mb-4 dashboard__content-heading">Education</h4>
        <table className="table" id="dashboard__content-table">
          <thead>
            <tr className='row'>
              <th className="col-4 table-item--sm table-item-md">School</th>
              <th className="col-4 table-item--sm table-item-md">Degree</th>
              <th className="col-3 table-item--sm table-item-md">Years</th>
              <th id="dashboard__table-filler-cell"></th>
            </tr>
          </thead>
          <tbody>{education}</tbody>
        </table>
      </div>
    );
  }
}

export default connect<{}, DispatchProps, OwnProps>(
  null,
  { deleteEducation }
)(Educations);
