// import spotify from 'spotify';
import axios from 'axios';

export default {
  searchForTrack(query, cb) {
    const options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=${query}&type=track`
    };
    axios(options)
    .then(res => {
      cb(res.data.tracks.items);
    });
  }
};
