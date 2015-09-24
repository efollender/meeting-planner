import {createReducer} from 'utils';
import uiConstants from '../constants/uiActions';

const initialState = {
  playing: false,
  paused: true,
  query: null
};

export default createReducer(initialState, {
  [uiConstants.PLAY] : () => {
    return {
      playing: true,
      paused: false
    };
  },
  [uiConstants.PAUSE] : () => {
    return {
      playing: false,
      paused: true
    };
  },
  [uiConstants.SUBMIT_SEARCH] : (store) => store
});
