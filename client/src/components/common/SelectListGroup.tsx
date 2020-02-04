import React, { ChangeEvent, FC } from 'react';
import classnames from 'classnames';

interface ListGroupOption {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  info: string;
  options: ListGroupOption[];
}

const SelectListGroup: FC<Props> = ({ name, value, error, info, onChange, options }) => {
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="form-group">
      <select
        className={classnames('form-control form-control-lg', {
          'is-invalid': error
        })}
        name={name}
        value={value}
        onChange={onChange}
      >
        {selectOptions}
      </select>
      {info && <div className="form-text text-muted">{info}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectListGroup;
