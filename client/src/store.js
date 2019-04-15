// import { applyMiddleware, compose, createStore } from 'redux';
// import combineReducers from './reducers/index';
// import thunk from 'redux-thunk';

// const initialState = {};
// const middleware = [thunk];

// const composeEnhancers =
//   typeof window === 'object' && window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
//     : compose;

// const composingMiddlewareAndDevTools = composeEnhancers(
//   applyMiddleware(...middleware)
// );

// const store = createStore(
//   combineReducers,
//   initialState,
//   composingMiddlewareAndDevTools
// );

// console.log(store.getState());

// export default store;

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
