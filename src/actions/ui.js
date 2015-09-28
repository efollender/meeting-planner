import {
    ADD_TRACK,
    CHANGE_RECORD,
    PLAY,
    PAUSE,
    SEARCH,
    SEARCH_SUCCESS
  } from 'constants/uiActions';

import * as firebase from 'actions/firebase';

export function addTrack (track) {
  return function cb(dispatch) {
    dispatch(firebase.addTrack(track));
    return {
      type: ADD_TRACK,
      data: track
    };
  };
}

export function searchSubmitted (query) {
  return {
    type: SEARCH,
    data: query
  };
}

export function searchSuccess (response) {
  return {
    type: SEARCH_SUCCESS,
    data: response
  };
}

export function pause () {
  return {
    type: PAUSE,
    data: 'pause'
  };
}

export function changeTrack (data) {
  return function cb(dispatch) {
    dispatch(firebase.setFirebase(data));
    return {
      type: CHANGE_RECORD,
      data: data
    };
  };
}

export function play () {
  return {
    type: PLAY,
    data: 'play'
  };
}
