import React, { Component } from 'react';

interface Props {
  resourceId?: string;
  subResourceId?: string;
  modalBody: string;
  modalTitle: string;
  modalId: string;
  tabIndex: number;
  onDelete: (resourceId: string, subResourceId: string) => void;
}

class ConfirmDeleteModal extends Component<Props> {
  public static defaultProps = {
    tabIndex: 0
  };

  handleClick = (resourceId = '', subResourceId = '') => {
    this.props.onDelete(resourceId, subResourceId);
  }

  render() {
    const { resourceId, modalId, modalTitle, modalBody, tabIndex } = this.props;

    return (
      <div className="modal fade" id={`${modalId}`} tabIndex={tabIndex} role="dialog" aria-labelledby={`${modalId}-ModalLabel`} aria-hidden="true">
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
              <button
                type="button"
                className="btn btn-secondary"
                id='modal-cancel'
                data-dismiss="modal">
                  Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                id={resourceId}
                onClick={
                  this.handleClick.bind(
                    this,
                    this.props.resourceId,                    
                    this.props.subResourceId
                  )
                }
                data-dismiss="modal">
                  Confirm Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmDeleteModal;
