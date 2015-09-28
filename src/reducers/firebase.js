import { createReducer } from 'utils';
import firebase from 'constants/firebase';

const initialState = {
  currentTrack: {
    title: '',
    artist: '',
    art: ''
  },
  queue: []
};

const toArray = (obj) => {
  if (obj === null) {
    return [];
  }
  return Object.keys(obj).map((key) => {
    obj[key]._key === key;
    return obj[key];
  });
};

export default createReducer(initialState, {
  [firebase.FETCH_FIREBASE_SUCCESS] : (store, data) => {
    const {currentTrack} = data;
    const dataArray = toArray(data.queue).slice(1, 10);
    return {
      queue: dataArray,
      currentTrack: {
        title: currentTrack.name,
        artist: currentTrack.artist,
        art: currentTrack.art
      }
    };
  },
  [firebase.SET_CURRENT_TRACK_SUCCESS] : (state, data) => {
    return {
      ...state,
      currentTrack: {
        title: data.name,
        artist: data.artist,
        art: data.art
      }
    };
  },
  [firebase.GET_PLAYLIST_SUCCESS] : (state, data) => {
    const dataArray = toArray(data).slice(1, 10);
    return {
      ...state,
      queue: dataArray
    };
  },
  [firebase.SET_PLAYLIST_SUCCESS] : (state) => {
    return {
      ...state
    };
  },
  [firebase.ADD_TRACK_SUCCESS] : (state) => {
    return {
      ...state

    };
  }
});
