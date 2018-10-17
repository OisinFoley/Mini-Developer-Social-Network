import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';



const BackButton = ({ route, additionalClasses }) => {
  return (
    <Link to={`/${route}`} className={`btn btn-light ${additionalClasses}`}>
      Go back
    </Link>
  );
};

BackButton.propTypes = {
  route: PropTypes.string.isRequired,
  additionalClasses: PropTypes.string,
};

BackButton.defaultProps = {
  type: 'text'
};

export default withRouter(BackButton);