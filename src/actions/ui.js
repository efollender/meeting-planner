import actions from 'constants/uiConstants';
import fbUtils from 'utils/firebaseUtils';

export function signInRequest() {
  return {
    type: actions.SIGN_IN_REQUEST
  };
}

export function signInSuccess(res) {
  return {
    type: actions.SIGN_IN_SUCCESS,
    data: res
  };
}

export function signInInvalid(res) {
  return {
    type: actions.SIGN_IN_INVALID,
    data: res
  };
}

export function signInError(res) {
  return {
    type: actions.SIGN_IN_ERROR,
    data: res
  };
}

export function signIn() {
  return function cb(dispatch) {
    dispatch(signInRequest());
    return fbUtils.signInWithGoogle( res => {
      console.log('signin', res);
      // if (res.error) {
      //   dispatch(signInError({error: res.error}));
      // } else if (res.invalid) {
      //   dispatch(signInInvalid({message: 'invalid email'}));
      // } else {
      //   dispatch(signInSuccess(res.authData));
      // }
    });
  };
}
