import { combineReducers } from 'redux';
import uiActions from './uiActions';
import firebase from './firebase';

export default combineReducers({
  uiActions,
  firebase
});
