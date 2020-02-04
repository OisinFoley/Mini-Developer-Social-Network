import React, { FC, ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthState } from '../../types/actionTypes';
import { PrivateRouteComponentState } from '../../types/stateTypes';
import { AppState } from '../../reducers/rootReducer';

interface StateProps {
  auth: AuthState;
}

interface OwnProps {
  exact: boolean;
}

interface Props extends RouteProps {
  component: ComponentType<any>;
  auth: AuthState;
}

export const PrivateRoute: FC<Props> = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const mapStateToProps = (state: PrivateRouteComponentState): StateProps => ({
  auth: state.auth
});

export default connect<StateProps, {}, {}, AppState>(mapStateToProps)(PrivateRoute);
