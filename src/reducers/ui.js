import {createReducer} from 'utils';
import * as uiConstants from 'constants/uiConstants';

const initialState = {
  session: {
    userName: null,
    email: null,
    token: null,
    userImage: null
  },
  loggedIn: false,
  message: null,
  schedule: null,
  roomStatus: {
    biggie: {
      name: 'biggie',
      taken: false
    },
    smalls: {
      name: 'smalls',
      taken: false
    },
    lounge: {
      name: 'lounge',
      taken: false
    }
  }
};

export default createReducer(initialState, {
  [uiConstants.SIGN_IN_REQUEST] : (store) => {
    return store;
  },
  [uiConstants.SIGN_IN_SUCCESS] : (store, data) => {
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
  [uiConstants.SIGN_IN_ERROR] : (store, data) => {
    return {
      ...store,
      message: data.error,
      loggedIn: false
    };
  },
  [uiConstants.SIGN_IN_INVALID] : (store, data) => {
    return {
      ...store,
      message: data.message,
      loggedIn: false
    };
  },
  [uiConstants.LOG_OUT] : (store) => {
    return {
      ...store,
      session: initialState.session,
      loggedIn: false,
      message: null,
      schedule: null
    };
  },
  [uiConstants.SCHEDULE_RECEIVED] : (store, data) => {
    return {
      ...store,
      schedule: data
    };
  },
  [uiConstants.ROOM_STATUS_RECEIVED] : (store, data) => {
    return {
      ...store,
      roomStatus: data
    };
  }
});
