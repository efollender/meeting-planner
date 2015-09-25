import axios from 'axios';

import {searchSubmitted, searchSuccess} from 'actions/ui';

export function searchForTrack(query) {
  return function (dispatch) {
    dispatch(searchSubmitted(query));
    const options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=${query}&type=track`
    };
    return axios(options)
      .then(res => {
        dispatch(searchSuccess(res.data.tracks.items));
      });
  };
}
