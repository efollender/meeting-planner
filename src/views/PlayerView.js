import React, {PropTypes}      from 'react';
import { connect } from 'react-redux';
import StyleSheet from '../styles/player.styl';
import * as UIActionCreators from 'actions/ui';
import * as SpotifyActionCreators from 'actions/spotify';
import * as FBActionCreators from 'actions/firebase';
import Search from 'components/Search';
import Queue from 'components/Queue';
import Turntable from 'components/Turntable';

// We define mapStateToProps where we'd normally use the @connect
// decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  uiActions : state.uiActions,
  firebase : state.firebase
});
export class PlayerView extends React.Component {
  static propTypes = {
    dispatch : PropTypes.func,
    uiActions  : PropTypes.object,
    firebase: PropTypes.object
  }

  constructor () {
    super();
  }
  componentWillMount() {
    this.props.dispatch(FBActionCreators.fetchFirebase());
  }
  _play () {
    this.props.dispatch(UIActionCreators.play());
  }

  _pause () {
    this.props.dispatch(UIActionCreators.pause());
  }
  _nextTrack () {
    const newQueue = this.props.firebase.queue.shift();
    const newData = {
      queue: this.props.firebase.queue,
      currentTrack: {
        title: newQueue.name,
        artist: newQueue.artist,
        art: newQueue.art,
        album: newQueue.album
      }
    };
    this.props.dispatch(UIActionCreators.changeTrack(newData));
  }
  _searchForTrack (query) {
    this.props.dispatch(SpotifyActionCreators.searchForTrack(query));
  }
  _addTrack (trackId) {
    this.props.dispatch(UIActionCreators.addTrack(trackId));
  }
  render () {
    const {playing, results} = this.props.uiActions;
    const {queue, currentTrack} = this.props.firebase;
    return (
      <div className='component-wrapper'>
        {queue.length > 1 &&
          <Queue playlist={queue} />
        }
        <div className={StyleSheet.player}>
          <Turntable
            current={currentTrack}
            playing={playing}
            nextTrack={::this._nextTrack}
            pause={::this._pause}
            queue={queue}
            play={::this._play} />
          <Search
            submitQuery={::this._searchForTrack}
            addTrack={::this._addTrack}
            results={results} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlayerView);
