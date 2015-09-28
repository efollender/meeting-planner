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
    const record = this.props.firebase.queue[0];
    this.props.dispatch(UIActionCreators.changeRecord(record));
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
      <div className={StyleSheet.player}>
        <Turntable
          current={currentTrack}
          playing={playing}
          nextTrack={this._nextTrack}
          pause={this._pause}
          play={this._play} />
        <Search submitQuery={::this._searchForTrack} />
        {results &&
          results.map( el =>
            <p key={el.id} className="track-list" onClick={this._addTrack.bind(this, el)}>{el.name}</p>
          )
        }
        {queue.length > 1 &&
          <Queue playlist={queue} />
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlayerView);
