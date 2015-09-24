import { combineReducers } from 'redux';
import counter from './counter';
import uiActions from './uiActions';
import firebase from './firebase';

export default combineReducers({
  counter,
  uiActions,
  firebase
});
