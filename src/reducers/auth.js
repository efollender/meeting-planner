import {createReducer} from 'utils';
import * as authConstants from 'constants/AuthConstants';

const initialState = {
  session: {
    userName: null,
    email: null,
    token: null,
    userImage: null
  },
  loggedIn: false,
  message: null
};

export default createReducer(initialState, {
  [authConstants.SIGN_IN_REQUEST] : (store) => {
    return {
      ...store,
      loggedIn: false
    };
  },
  [authConstants.SIGN_IN_SUCCESS] : (store, data) => {
    return {
      ...store,
      loggedIn: true,
      session: {
        userName: data.google.displayName,
        email: data.google.email,
        userImage: data.google.profileImageURL,
        token: data.google.accessToken
      }
    };
  },
  [authConstants.SIGN_IN_ERROR] : (store, data) => {
    return {
      ...store,
      message: data.error,
      loggedIn: false
    };
  },
  [authConstants.SIGN_IN_INVALID] : (store, data) => {
    return {
      ...store,
      message: data.message,
      loggedIn: false
    };
  },
  [authConstants.LOG_OUT] : (store) => {
    return {
      ...store,
      ...initialState
    };
  }
});
