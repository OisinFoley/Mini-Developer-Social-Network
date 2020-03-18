import React from 'react';

import * as spinner from './spinner.gif';

export default (): JSX.Element => {
  return (
    <div>
      <img src={spinner} className="spinner" alt="Loading..." />
    </div>
  );
};
