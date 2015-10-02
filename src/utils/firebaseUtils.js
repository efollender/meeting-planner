// import axios from 'axios';
import Firebase from 'firebase';
import creds from '../../lib/creds';

const FBRef = new Firebase(creds.firebase);

// const checkDomain = function(email) {
//   const re = /(@brooklynunited.com)/;
//   if (re.test(email)) return true;
//   return false;
// };

export function signInWithGoogle(cb) {
  FBRef.authWithOAuthPopup('google', (error, authData) => {
    // let valid;
    // if (authData !== undefined) {
    //   valid = checkDomain(authData.google.email);
    // }
    // const res = {
    //   error: error,
    //   authData: authData,
    //   valid: valid
    // };
    console.log(error);
    cb(authData);
  }, {
    scope: 'email'
  });
}


