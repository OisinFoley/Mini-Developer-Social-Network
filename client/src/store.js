import { applyMiddleware, compose, createStore } from 'redux';
import combineReducers from './reducers/index';
import thunk from 'redux-thunk';

const initialState = {};
const middleware = [thunk];

const composeEnhancers =
  typeof window === 'object' && window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const composingMiddlewareAndDevTools = composeEnhancers(
  applyMiddleware(...middleware)
);

const store = createStore(
  combineReducers,
  initialState,
  composingMiddlewareAndDevTools
);

export default store;