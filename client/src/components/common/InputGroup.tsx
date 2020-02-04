import React, { ChangeEvent, FC } from 'react';
import classnames from 'classnames';

interface Props {
  name: string;
  value?: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  placeholder: string;
}

const InputGroup: FC<Props> = ({ name, value, error, onChange, icon, placeholder }) => {
  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend set-profile__social-icon-wrapper">
        <span className="input-group-text set-profile__social-icon-span">
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

export default InputGroup;
