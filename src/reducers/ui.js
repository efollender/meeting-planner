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
  schedule: [],
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
  },
  allMeetings: [],
  dateLookup: {},
  availability: {
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
  [uiConstants.AVAILABILITY_REQUEST] : (store) => {
    return store;
  },
  [uiConstants.AVAILABILITY_RECEIVED] : (store, data) => {
    return {
      ...store,
      availability: data
    };
  },
  [uiConstants.SIGN_IN_REQUEST] : (store) => {
    return {
      ...store,
      loggedIn: false
    };
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
      ...initialState
    };
  },
  [uiConstants.SCHEDULE_REQUEST] : (store) => {
    return {
      ...store,
      loading: true
    };
  },
  [uiConstants.SCHEDULE_RECEIVED] : (store, data) => {
    return {
      ...store,
      schedule: data,
      loading: false,
      lastScheduleRequest: Date.parse(new Date())
    };
  },
  [uiConstants.ROOM_STATUS_REQUEST] : (store) => {
    return {
      ...store,
      loading: true
    };
  },
  [uiConstants.ROOM_STATUS_RECEIVED] : (store, data) => {
    return {
      ...store,
      roomStatus: data[0],
      allMeetings: data[1].items,
      dateLookup: data[1],
      loading: false,
      lastRoomRequest: Date.parse(new Date())
    };
  },
  [uiConstants.ROOM_STATUS_ERROR] : (store, data) => {
    return {
      ...store,
      error: data,
      loggedIn: false
    };
  },
  [uiConstants.DATE_LOOKUP_REQUEST] : (store) => {
    return {
      ...store,
      loading: true
    };
  },
  [uiConstants.DATE_LOOKUP_RECEIVED] : (store, data) => {
    return {
      ...store,
      dateLookup: data,
      loading: false
    };
  }
});
