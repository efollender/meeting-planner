import React, {PropTypes}      from 'react';
import { connect } from 'react-redux';
import classNames from 'classNames';
import StyleSheet from '../styles/player.styl';
import * as UIActionCreators from 'actions/ui';
import * as SpotifyActionCreators from 'actions/spotify';
import * as FBActionCreators from 'actions/firebase';
import Search from '../components/Search';

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
  _play () {
    this.props.dispatch(UIActionCreators.play());
  }

  _pause () {
    this.props.dispatch(UIActionCreators.pause());
  }
  _nextTrack () {
    const record = this.props.uiActions.newTrack;
    this.props.dispatch(UIActionCreators.changeRecord(record));
  }
  _searchForTrack (query) {
    this.props.dispatch(SpotifyActionCreators.searchForTrack(query));
  }
  _addTrack (trackId) {
    this.props.dispatch(FBActionCreators.addTrack(trackId));
    this.setState({
      uiActions: {
        ...this.props.uiActions,
        query: null
      }
    });
  }
  render () {
    const {playing, results} = this.props.uiActions;
    const {title, artist, art} = this.props.firebase.currentTrack;
    return (
      <div className={StyleSheet.player}>
        <div className="player-current">
          <h2>{playing && 'playing'} {!playing && 'paused'}</h2>
          <div
            className={classNames('turntable', 'vinyl', {
              'playing': playing
            })}>
            <div className="turntable-inner" style={{backgroundImage:`url(${art})`}} />
          </div>
          <p className="track-title">
            {title}
          </p>
          <p className="track-artist">
            {artist}
          </p>
          <div className="player-controls">
            <span className='fa fa-angle-left'/>
            {!playing &&
              <span className='fa fa-play' onClick={::this._play}/>
            }
            {playing &&
              <span className='fa fa-pause' onClick={::this._pause}/>
            }
            <span className='fa fa-angle-right' onClick={::this._nextTrack} />
          </div>
        </div>
        <div className="player-next">
          <p className="next-label">Next</p>
          <p className="next-track-title">
            {title}
          </p>
          <p className="next-track-artist">
            {artist}
          </p>
        </div>
        <Search submitQuery={::this._searchForTrack} />
        {results &&
          results.map( el =>
            <p key={el.id} className="track-list" onClick={this._addTrack.bind(this, el)}>{el.name}</p>
          )
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlayerView);
