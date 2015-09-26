import { createReducer } from 'utils';
import firebase from 'constants/firebase';

const initialState = {
  currentTrack: {
    title: 'The house that heaven built',
    artist: 'japandroids',
    art: 'http://cdn2.pitchfork.com/albums/17735/homepage_large.6cc98599.jpg'
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
  [firebase.CHANGE_TRACK] : (state, data) => {
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
      queue: dataArray,
      currentTrack:{
        title: dataArray[8].name,
        artist: dataArray[8].artist,
        art: dataArray[8].art
      }
    };
  }
});
