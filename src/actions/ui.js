import {
    ADD_TRACK,
    CHANGE_RECORD,
    CHANGE_RECORD_SUCCESS,
    PLAY,
    PAUSE,
    SEARCH,
    SET_DATA,
    SEARCH_SUCCESS
  } from 'constants/uiActions';

import * as firebase from 'utils/firebaseUtils';

// const handleErr = (err) => {
//   if (err) return 'There was an error :(';
//   return false;
// };

export function setData(data) {
  return {
    type: SET_DATA,
    data: data
  };
}

export function addedTrack(track) {
  return {
    type: ADD_TRACK,
    data: track
  };
}

export function addTrack (track) {
  return function cb(dispatch) {
    return firebase.addTrack(track, (err) => {
      if (!err) dispatch(addedTrack(track));
    });
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

export function pausePlayer() {
  return {
    type: PAUSE
  };
}

export function unPausePlayer() {
  return {
    type: PLAY
  };
}

export function pause () {
  return dispatch => {
    return firebase.pause((err) => {
      if (err === null) dispatch(pausePlayer());
    });
  };
}

export function play () {
  return dispatch => {
    return firebase.play((err) => {
      if (err === null) dispatch(unPausePlayer());
    });
  };
}

export function changingTrack () {
  return {
    type: CHANGE_RECORD
  };
}

export function changeTrackSuccess (data) {
  return {
    type: CHANGE_RECORD_SUCCESS,
    data: data
  };
}

export function changeTrack (data) {
  return function cb(dispatch) {
    dispatch(changingTrack);
    return firebase.setCurrent(data, err => {
      if (err === null) dispatch(changeTrackSuccess(data));
    });
  };
}
