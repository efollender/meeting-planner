import Firebase from 'firebase';

import {
  ADDING_TRACK,
  ADD_TRACK_SUCCESS,
  // CHANGE_TRACK,
  GET_PLAYLIST,
  GET_PLAYLIST_SUCCESS
} from 'constants/firebase';

const fbRef = new Firebase('https://bu.firebaseio.com/spotifyData');

export function getTracks () {
  return {
    type: GET_PLAYLIST
  };
}

export function getTracksSuccess (tracks) {
  return {
    type: GET_PLAYLIST_SUCCESS,
    data: tracks
  };
}

export function changeTrack () {
  return function(dispatch) {
    dispatch(getTracks);
    return fbRef.child('queue').once('value', snapshot => {
      dispatch(getTracksSuccess(snapshot.val()));
    });
  };
}

export function addingTrack () {
  return {
    type: ADDING_TRACK
  };
}

export function addTrackSuccess (res) {
  return {
    type: ADD_TRACK_SUCCESS,
    data: res
  };
}

export function addTrack(track) {
  return function (dispatch) {
    dispatch(addingTrack);
    return fbRef.child('queue').push({
      name: track.name,
      id: track.id,
      uri: track.uri,
      artist: track.artists[0].name,
      album: track.album.name
    }, res => dispatch(addTrackSuccess(res)));
  };
}
