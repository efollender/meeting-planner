import * as uiConstants from 'constants/uiConstants';
import * as fbUtils from 'utils/firebaseUtils';

// const checkValidity = function(email) {
//   const regex = /(@brooklynunited.com)/;
//   return regex.test(email);
// }

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

export function roomStatusReceived(status) {
  return {
    type: uiConstants.ROOM_STATUS_RECEIVED,
    data: status
  };
}

export function checkRooms() {
  return dispatch => {
    return fbUtils.getSession(res => {
      if (res.google) {
        const token = res.google.accessToken;
        return fbUtils.checkRooms(token, rooms => {
          dispatch(roomStatusReceived(rooms));
        });
      }
    });
  };
}

// export function getUserInfo(userID) {
//   return dispatch => {
//     return fbUtils.getUser( res => {
//       if (res.userImg) return res;
//       return fbUtils.getUserFromGoogle(userID, res => {
//         return res.data;
//       });
//     });
//   };
// }

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
