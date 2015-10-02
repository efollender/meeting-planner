import {createReducer} from 'utils';
import actions from 'constants/uiConstants';

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
  [actions.SIGN_IN_REQUEST] : (store) => {
    return store;
  },
  [actions.SIGN_IN_SUCCESS] : (store, data) => {
    return {
      ...store,
      ...data,
      loggedIn: true
      // session: {
      //   userName: data.google.displayName,
      //   email: data.google.email,
      //   userImage: data.google.profileImageURL,
      //   token: data.token
      // }
    };
  },
  [actions.SIGN_IN_ERROR] : (store, data) => {
    return {
      ...store,
      message: data.error,
      loggedIn: false
    };
  },
  [actions.SIGN_IN_INVALID] : (store, data) => {
    return {
      ...store,
      message: data.message,
      loggedIn: false
    };
  }
});
