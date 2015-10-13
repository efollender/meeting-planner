import { compose, createStore, applyMiddleware } from 'redux';
import { devTools } from 'redux-devtools';
import rootReducer from 'reducers';
import thunk from 'redux-thunk';

let createStoreWithMiddleware;

if (__DEBUG__) {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunk),
    devTools())(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
}

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
