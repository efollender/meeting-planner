import * as authConstants from 'constants/AuthConstants';
import * as fbUtils from 'utils/firebaseUtils';

export function signInRequest() {
  return {
    type: authConstants.SIGN_IN_REQUEST
  };
}

export function signInSuccess(res) {
  fbUtils.persistUser(res);
  return {
    type: authConstants.SIGN_IN_SUCCESS,
    data: res
  };
}

export function signInInvalid(res) {
  return {
    type: authConstants.SIGN_IN_INVALID,
    data: res
  };
}

export function signInError(res) {
  return {
    type: authConstants.SIGN_IN_ERROR,
    data: res
  };
}

export function sessionRequest() {
  return {
    type: authConstants.SESSION_REQUEST
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
        window.location.reload();
      }
    });
  };
}

export function logOut() {
  fbUtils.logOut();
  return {
    type: authConstants.LOG_OUT
  };
}
