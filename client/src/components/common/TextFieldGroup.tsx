import React, { ChangeEvent, FC } from 'react';
import classnames from 'classnames';

interface Props {
  name: string;
  placeholder: string;
  value: any;
  error?: string;
  info?: string;
  type?: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TextFieldGroup: FC<Props> = ({
  name,
  placeholder,
  value,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className={classnames('form-control form-control-lg', {
          'is-invalid': error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {info && <div className="form-text text-muted">{info}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
