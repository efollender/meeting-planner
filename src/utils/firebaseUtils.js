import Firebase from 'firebase';
import {firebase} from '../../lib/config';

const FBRef = new Firebase(firebase);

export default {
  setFirebase(data, cb) {
    FBRef.set(data, err => {
      cb(err);
    });
  },
  fetchFirebase(cb) {
    FBRef.once('value', snapshot => {
      cb(snapshot.val());
    });
  },
  pause(cb) {
    FBRef.child('paused').set(true, err => {
      cb(err);
    });
  },
  play(cb) {
    FBRef.update({paused: false}, err => {
      cb(err);
    });
  },
  setCurrent(data, cb) {
    FBRef.update(data, err => {
      cb(err);
    });
  },
  setPlaylist(playlist, cb) {
    FBRef.update({playlist: playlist}, err => {
      cb(err);
    });
  },
  addTrack(track, cb) {
    FBRef.child('playlist').push({
      name: track.name,
      id: track.id,
      uri: track.uri,
      artist: track.artists[0].name,
      album: track.album.name,
      art: track.album.images[1].url
    }, err => {
      cb(err);
    });
  },
  watchFirebase(cb) {
    FBRef.on('value', snapshot => {
      cb(snapshot.val());
    });
  }
};
