import { applyMiddleware, compose, createStore } from 'redux';
import { rootReducer } from './reducers/rootReducer';
import thunk from 'redux-thunk';

const initialState = {};
const middleware = [thunk];

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const composingMiddlewareAndDevTools = composeEnhancers(
  applyMiddleware(...middleware)
);

const store = createStore(
  rootReducer,
  initialState,
  composingMiddlewareAndDevTools
);

export default store;
