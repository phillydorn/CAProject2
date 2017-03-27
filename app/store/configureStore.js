import { createStore, applyMiddleware, compose } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunkMiddleware from 'redux-thunk';
// import apiMiddleware from '../middleware/api';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';


// const logger = createLogger({
//   level: 'info',
//   collapsed: false,
//   logger: console,
//   predicate: (getState, action) => { return true; },
// });

const socket = io('http://localhost:3000');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

function reducer(state={}, action) {
  switch(action.type) {
    case 'message':
      return Object.assign({}, {message: action.data});
    default:
      return state;
  }
}

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, socketIoMiddleware)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState, compose(
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
      window.devToolsExtension() : (f) => { return f; }
    ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
