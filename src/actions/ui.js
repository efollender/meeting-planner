import * as uiConstants from 'constants/uiConstants';
import * as fbUtils from 'utils/firebaseUtils';

export function availabilityRequest() {
  return {
    type: uiConstants.AVAILABILITY_REQUEST
  };
}

export function availabilityReceived(data) {
  return {
    type: uiConstants.AVAILABILITY_RECEIVED,
    data: data
  };
}

export function signInRequest() {
  return {
    type: uiConstants.SIGN_IN_REQUEST
  };
}

export function signInSuccess(res) {
  fbUtils.persistUser(res);
  return {
    type: uiConstants.SIGN_IN_SUCCESS,
    data: res
  };
}

export function signInInvalid(res) {
  return {
    type: uiConstants.SIGN_IN_INVALID,
    data: res
  };
}

export function signInError(res) {
  return {
    type: uiConstants.SIGN_IN_ERROR,
    data: res
  };
}

export function sessionRequest() {
  return {
    type: uiConstants.SESSION_REQUEST
  };
}

export function scheduleRequest() {
  return {
    type: uiConstants.SCHEDULE_REQUEST
  };
}

export function scheduleReceived(sched) {
  return {
    type: uiConstants.SCHEDULE_RECEIVED,
    data: sched
  };
}

export function roomStatusReceived(status, meetings) {
  return {
    type: uiConstants.ROOM_STATUS_RECEIVED,
    data: [status, meetings]
  };
}

export function roomStatusRequest() {
  return {
    type: uiConstants.ROOM_STATUS_REQUEST
  };
}
export function roomStatusError() {
  return {
    type: uiConstants.ROOM_STATUS_ERROR
  };
}

export function dateLookupRequest() {
  return {
    type: uiConstants.DATE_LOOKUP_REQUEST
  };
}

export function dateLookupReceived(data) {
  return {
    type: uiConstants.DATE_LOOKUP_RECEIVED,
    data: data
  };
}

export function getAvailability(date) {
  return dispatch => {
    dispatch(availabilityRequest());
    return fbUtils.getSession(res => {
      if (res.google) {
        const data = {
          token: res.google.accessToken,
          date: date
        };
        return fbUtils.getAvailability(data, status => {
          dispatch(availabilityReceived(status));
        });
      }
    });
  };
}

export function dateLookup(date) {
  return dispatch => {
    dispatch(dateLookupRequest());
    return fbUtils.getSession(res => {
      if (res.google) {
        const data = {
          token: res.google.accessToken,
          ...date
        };
        return fbUtils.checkRooms(data, (rooms, meetings) => {
          dispatch(dateLookupReceived(meetings));
        });
      }
    });
  };
}

export function checkRooms(time) {
  if (time) return dateLookup(time);
  return dispatch => {
    dispatch(roomStatusRequest());
    return fbUtils.getSession(res => {
      if (res.google) {
        const data = {
          token: res.google.accessToken
        };
        return fbUtils.checkRooms(data, (rooms, meetings) => {
          if (!meetings) {
            dispatch(roomStatusError());
          } else {
            dispatch(roomStatusReceived(rooms, meetings));
          }
        });
      }
    });
  };
}

export function getSchedule() {
  return dispatch => {
    dispatch(scheduleRequest());
    return fbUtils.getSession( res =>{
      if (res.google) {
        const token = res.google.accessToken;
        return fbUtils.getSchedule(token, sched => {
          dispatch(scheduleReceived(sched));
        });
      }
    });
  };
}

export function getSession() {
  return dispatch => {
    dispatch(sessionRequest());
    return fbUtils.getSession( res => {
      if (res.google) {
        dispatch(signInSuccess(res));
      }
    });
  };
}

export function signIn() {
  return (dispatch) => {
    dispatch(signInRequest());
    return fbUtils.signInWithGoogle( res => {
      if (res.error) {
        dispatch(signInError({error: res.error}));
      } else if (!res.valid) {
        fbUtils.logOut();
        dispatch(signInInvalid({message: 'invalid email'}));
      } else {
        dispatch(signInSuccess({...res.authData, schedule: res.schedule}));
      }
    });
  };
}

export function logOut() {
  fbUtils.logOut();
  return {
    type: uiConstants.LOG_OUT
  };
}
