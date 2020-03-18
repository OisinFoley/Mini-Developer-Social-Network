import React, { ChangeEvent, FC } from 'react';
import classnames from 'classnames';

interface Props {
  name: string;
  placeholder: string;
  value: any;
  error?: string;
  info?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaFieldGroup: FC<Props> = ({
  name,
  placeholder,
  value,
  error,
  info,
  onChange
}) => {
  return (
    <div className="form-group">
      <textarea
        className={classnames('form-control form-control-lg', {
          'is-invalid': error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {info && <div className="form-text text-muted">{info}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default TextAreaFieldGroup;
