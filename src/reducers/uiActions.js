import {createReducer} from 'utils';
import uiConstants from 'constants/uiActions';

const initialState = {
  playing: false,
  paused: true,
  query: null
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
        album: track.album.name
      }
    };
  },
  [uiConstants.CHANGE_RECORD] : (store) => {
    return {
      ...store,
      playing
    };
  },
  [uiConstants.PLAY] : () => {
    return {
      playing: true,
      paused: false
    };
  },
  [uiConstants.PAUSE] : () => {
    return {
      playing: false,
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
  }
});
