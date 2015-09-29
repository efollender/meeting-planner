import {createReducer} from 'utils';
import uiConstants from 'constants/uiActions';

const toArray = (obj) => {
  if ((obj === null) || (obj === undefined)) {
    return [];
  }
  return Object.keys(obj).map((key) => {
    obj[key]._key === key;
    return obj[key];
  });
};

const initialState = {
  currentTrack: {
    title: '',
    artist: '',
    art: '',
    id: '',
    uri: ''
  },
  playlist: [],
  paused: false,
  results: [],
  query: ''
};

export default createReducer(initialState, {
  [uiConstants.ADD_TRACK] : (store, track) => {
    return {
      ...store,
      newTrack: {
        name: track.name,
        id: track.id,
        uri: track.uri,
        artist: track.artists[0].name,
        album: track.album.name,
        art: track.album.images[1].url
      },
      query: null,
      results: []
    };
  },
  [uiConstants.CHANGE_RECORD] : (store) => {
    return {
      ...store,
      results: []
    };
  },
  [uiConstants.PLAY] : (store) => {
    return {
      ...store,
      paused: false
    };
  },
  [uiConstants.PAUSE] : (store) => {
    return {
      ...store,
      paused: true
    };
  },
  [uiConstants.SEARCH] : (store, data) => {
    return {
      ...store,
      query: data
    };
  },
  [uiConstants.SEARCH_SUCCESS] : (store, data) => {
    return {
      ...store,
      results: data
    };
  },
  [uiConstants.SET_DATA] : (store, data) => {
    const dataArray = toArray(data.playlist);
    return {
      ...store,
      ...data,
      playlist: dataArray
    };
  }
});
