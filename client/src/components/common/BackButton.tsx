import React, { FC } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  route: string;
  additionalClasses?: string;
}

const BackButton: FC<Props> = ({ route, additionalClasses }) => {
  return (
    <Link to={`/${route}`} className={`btn btn-light ${additionalClasses}`}>
      Go back
    </Link>
  );
};

export default withRouter(BackButton);
