import Firebase from 'firebase';

import {
  ADDING_TRACK,
  ADD_TRACK_SUCCESS,
  NEXT_TRACK,
  REMOVE_TRACK,
  FETCH_FIREBASE_SUCCESS,
  GET_PLAYLIST,
  GET_PLAYLIST_SUCCESS,
  SET_CURRENT_TRACK,
  SET_CURRENT_TRACK_SUCCESS,
  SET_FIREBASE,
  SET_FIREBASE_SUCCESS,
  SET_PLAYLIST,
  SET_PLAYLIST_SUCCESS
} from 'constants/firebase';

const fbRef = new Firebase('https://bu.firebaseio.com/spotifyData');

export function settingPlaylist () {
  return {
    type: SET_PLAYLIST
  };
}

export function setPlaylistSuccess () {
  return {
    type: SET_PLAYLIST_SUCCESS
  };
}

export function setPlaylist (playlist) {
  return function cb(dispatch) {
    dispatch(settingPlaylist);
    return fbRef.child('queue').set(playlist, err => {
      if (!err) { dispatch(setPlaylistSuccess); }
    });
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

export function fetchTracks () {
  return function cb(dispatch) {
    dispatch(getTracks);
    return fbRef.child('queue').once('value', snapshot => {
      dispatch(getTracksSuccess(snapshot.val()));
    });
  };
}

export function fetchFirebaseSuccess (res) {
  return {
    type: FETCH_FIREBASE_SUCCESS,
    data: res
  };
}

export function fetchFirebase () {
  return function cb(dispatch) {
    return fbRef.once('value', snapshot => {
      dispatch(fetchFirebaseSuccess(snapshot.val()));
    });
  };
}

export function setFirebaseSuccess (data) {
  return {
    type: SET_FIREBASE_SUCCESS,
    data: data
  };
}

export function settingFirebase() {
  return {
    type: SET_FIREBASE
  };
}

export function setFirebase(data) {
  return function cb(dispatch) {
    dispatch(settingFirebase);
    return fbRef.set(data, err => {
      if (!err) {
        dispatch(setFirebaseSuccess(data));
      }
    });
  };
}

export function setCurrentTrack() {
  return {
    type: SET_CURRENT_TRACK
  };
}

export function setCurrentTrackSuccess(track) {
  return {
    type: SET_CURRENT_TRACK_SUCCESS,
    data: track
  };
}

export function changeTrack (track) {
  return function cb(dispatch) {
    dispatch(setCurrentTrack);
    return fbRef.child('currentTrack').set(track, err => {
      if (!err) {
        dispatch(setCurrentTrackSuccess(track));
      } else {
        dispatch(setCurrentTrackSuccess(track));
      }
    });
  };
}

export function addingTrack () {
  return {
    type: ADDING_TRACK
  };
}

export function addTrackSuccess (data) {
  return {
    type: ADD_TRACK_SUCCESS,
    data: data
  };
}

export function addTrack(track) {
  return function cb(dispatch) {
    dispatch(addingTrack);
    const newTrack = {
      name: track.name,
      id: track.id,
      uri: track.uri,
      artist: track.artists[0].name,
      album: track.album.name,
      art: track.album.images[1].url
    };
    return fbRef.child('queue').push(newTrack, err => {
      if (err === null) {
        dispatch(addTrackSuccess(newTrack));
      }
    });
  };
}
