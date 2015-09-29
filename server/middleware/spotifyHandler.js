import data from '../../lib/config.js';
import Firebase from 'firebase';
import axios from 'axios';
import ObjectAssign from 'object-assign';

const FirebaseRef = new Firebase(data.firebase);

const options = {
    appkeyFile: data.key //required
};

const spotify = require('node-spotify')(options);

const notPlaying = {
	title: "Nothing Selected",
	artist: "Pick a Song",
	album: "We Want Music!",
	duration: 0,
	link: "nothing:tosee:here",
	art: "https://lh4.ggpht.com/NjSeU8ya6h8cNL6JntWZqhlkmAHKcy0vJmxDBqF0x_y4izs6skpxg6a4TRsf3Jza7kk=w300"
};

const buildResponse = function(array) {
	let response = {};
	array.forEach(song => {
			return response[array.indexOf(song)] = {
				title: song.name,
				artist: song.artists[0].name, 				
				album: song.album.name,
				duration: song.duration, 
				link: song.link
			}
		});
	return response;
};

const SpotifyHandler = function(spotify, FirebaseRef){
	this.playlist = null;
	this.firebase = FirebaseRef;
	this.currentTrack = null;
	this.spotify = spotify;
	this.spotify.login(data.spotifyUser, data.spotifyPassword, null, null);
	this.spotify.on({
		ready: () => {
			this.startSpotify();
		}
	});
	this.firebase.child('paused').on('value', (snapshot) => {
		if(snapshot.val() == true){
			return this.spotify.player.pause();
		}
		return this.spotify.player.resume();
	});
	this.play = function(){
		const track = this.spotify.createFromLink(this.currentTrack.uri);
		if (track) this.spotify.player.play(track);
	};
	this.startSpotify = function(){
		this.firebase.child('currentTrack').on('value', snapshot => {
			this.currentTrack = snapshot.val();
			this.play();
		});
	};
	this.spotify.player.on({
		endOfTrack: () => {
			this.firebase.child('trackEnded').set(true);
		}
	});
};

export default new SpotifyHandler(spotify, FirebaseRef);