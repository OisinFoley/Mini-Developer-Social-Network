import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputGroup = ({ name, value, error, onChange, icon, placeholder }) => {
  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend edit-profile__social-icon-wrapper">
        <span className="input-group-text edit-profile__social-icon-span">
          <i className={icon} />
        </span>
      </div>
      <input
        className={classnames('form-control form-control-lg', {
          'is-invalid': error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

InputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  icon: PropTypes.string
};

InputGroup.defaultProps = {
  type: 'text'
};

export default InputGroup;
