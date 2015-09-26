import Firebase from 'firebase';

import {
  ADDING_TRACK,
  ADD_TRACK_SUCCESS,
  NEXT_TRACK,
  REMOVE_TRACK,
  GET_PLAYLIST,
  GET_PLAYLIST_SUCCESS
} from 'constants/firebase';

const fbRef = new Firebase('https://bu.firebaseio.com/spotifyData');

export function getTracks () {
  return {
    type: GET_PLAYLIST
  };
}

export function nextTrack() {
  return {
    type: NEXT_TRACK
  };
}

export function removeTrack (track) {
  return {
    type: REMOVE_TRACK,
    data: track
  };
}

export function getTracksSuccess (tracks) {
  return {
    type: GET_PLAYLIST_SUCCESS,
    data: tracks
  };
}

export function changeTrack () {
  return function cb(dispatch) {
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
  return function cb(dispatch) {
    dispatch(addingTrack);
    return fbRef.child('queue').push({
      name: track.name,
      id: track.id,
      uri: track.uri,
      artist: track.artists[0].name,
      album: track.album.name,
      art: track.album.images[1].url
    }, err => {
      if (err === null) {
        dispatch(addTrackSuccess(snapshot.val())));
      } else {

      }
    }
  };
}
