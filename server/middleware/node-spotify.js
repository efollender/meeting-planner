import spotifyHandler from 'spotify';

const options = {
  appKeyFile: '../../lib/spotify_appkey.key'
};
const spotify = spotifyHandler(options);

function ready(err) {
  if(err) {
      console.log('Login failed', err);
  } else {
      console.log('node-spotify is ready to exeute more code!');
  }
};

export default function startSpotify() {

  spotify.on({
    ready: ready
  };
}