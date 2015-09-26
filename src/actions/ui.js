import {
    ADD_TRACK,
    CHANGE_RECORD,
    PLAY,
    PAUSE,
    SEARCH,
    SEARCH_SUCCESS
  } from 'constants/uiActions';

import {changeTrack} from 'actions/firebase';

export function addTrack (track) {
  return {
    type: ADD_TRACK,
    data: track
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

export function changeRecord (track) {
  return function cb(dispatch) {
    dispatch(changeTrack(track));
    return {
      type: CHANGE_RECORD
    };
  };
}

export function play () {
  return {
    type: PLAY,
    data: 'play'
  };
}
