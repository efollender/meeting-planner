import { createReducer } from 'utils';
import firebase from 'constants/firebase';

const initialState = {
  currentTrack: {
    title: '',
    artist: '',
    art: '',
    uri: ''
  },
  playlist: [],
  paused: false,
  playing: true
};

const toArray = (obj) => {
  if ((obj === null) || (obj === undefined)) {
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
    const dataArray = toArray(data.playlist);
    return {
      ...data,
      playlist: dataArray,
      currentTrack: {
        title: currentTrack.name,
        artist: currentTrack.artist,
        art: currentTrack.art,
        uri: currentTrack.uri
      }
    };
  },
  [firebase.SET_CURRENT_TRACK_SUCCESS] : (state, data) => {
    return {
      ...state,
      currentTrack: {
        title: data.name,
        artist: data.artist,
        art: data.art,
        uri: currentTrack.uri
      }
    };
  },
  [firebase.GET_PLAYLIST_SUCCESS] : (state, data) => {
    const dataArray = toArray(data.playlist);
    return {
      ...state,
      playlist: dataArray
    };
  },
  [firebase.SET_FIREBASE_SUCCESS] : (state, data) => {
    return data;
  },
  [firebase.SET_PLAYLIST_SUCCESS] : (state) => {
    return {
      ...state
    };
  },
  [firebase.ADD_TRACK_SUCCESS] : (state, track) => {
    return {
      ...state,
      playlist: state.playlist.concat(track)
    };
  }
});
