import React, {PropTypes}      from 'react';
import { connect } from 'react-redux';
import StyleSheet from '../styles/player.styl';
import * as UIActionCreators from 'actions/ui';
import * as SpotifyActionCreators from 'actions/spotify';
import * as FBActionCreators from 'actions/firebase';
import Search from 'components/Search';
import Queue from 'components/Queue';
import Turntable from 'components/Turntable';
import FBUtil from 'utils/firebaseUtils';

// We define mapStateToProps where we'd normally use the @connect
// decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  uiActions : state.uiActions
});
export class PlayerView extends React.Component {
  static propTypes = {
    dispatch : PropTypes.func,
    uiActions  : PropTypes.object
  }

  constructor () {
    super();
  }
  componentWillMount() {
    this.props.dispatch(FBActionCreators.fetchFirebase());
  }
  componentDidMount() {
    FBUtil.watchFirebase((res) => {
      this.props.dispatch(UIActionCreators.setData(res));
    });
  }
  _play () {
    this.props.dispatch(UIActionCreators.play());
  }

  _pause () {
    this.props.dispatch(UIActionCreators.pause());
  }
  _nextTrack () {
    const newQueue = this.props.uiActions.playlist.shift();
    const newData = {
      playlist: this.props.uiActions.playlist,
      currentTrack: newQueue
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
    const {paused, results, playlist, currentTrack} = this.props.uiActions;
    return (
      <div className='component-wrapper'>
        {playlist.length > 1 &&
          <Queue playlist={playlist} />
        }
        <div className={StyleSheet.player}>
          <Turntable
            current={currentTrack}
            paused={paused}
            nextTrack={::this._nextTrack}
            pause={::this._pause}
            playlist={playlist}
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
