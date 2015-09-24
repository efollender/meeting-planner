import { createReducer } from 'utils';
import firebaseUtils from '../utils/firebaseUtils';
import firebase from '../constants/firebase';

const initialState = {
  currentTrack: {
    title: 'The house that heaven built',
    artist: 'japandroids',
    art: 'http://cdn2.pitchfork.com/albums/17735/homepage_large.6cc98599.jpg'
  },
  queue: []
};

export default createReducer(initialState, {
  [firebase.GET_CURRENT_TRACK] : (state) => {
    console.log(state);
    return {
      ...state,
      currentTrack: firebaseUtils.getTracks()
    };
  }
});
