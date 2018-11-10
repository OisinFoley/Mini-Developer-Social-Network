import React, { Component } from 'react';
import PropTypes from 'prop-types';

// const ConfirmDeleteModal = ({ modalTitle, modalBody, id, onDelete }) => {
class ConfirmDeleteModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
   this.handleClick = this.handleClick.bind(this);
 }

  handleClick() {
    let clicked_id = this.props.id;
    this.props.onDelete(clicked_id);
  }

  render() {

    let modalId = this.props.modalId;
    let modalTitle = this.props.modalTitle;
    let modalBody = this.props.modalBody;

    return (
      <div className="modal fade" id={`${modalId}`} tabIndex="-1" role="dialog" aria-labelledby={`${modalId}-ModalLabel`} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${modalId}-ModalLabel`}>{modalTitle}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
            {modalBody}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              {/* we're doing something silly here that means we end up passing the first occurance of the delete button as the bound "this" */}
              <button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, this.props.id)} data-dismiss="modal">Confirm Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

ConfirmDeleteModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalBody: PropTypes.string.isRequired
};

ConfirmDeleteModal.defaultProps = {
  type: 'text'
};

export default ConfirmDeleteModal;