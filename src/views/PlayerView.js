import React, {PropTypes}      from 'react';
import { connect } from 'react-redux';
import classNames from 'classNames';
import StyleSheet from '../styles/player.styl';

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
    this.props.dispatch({ type : 'PLAY' });
  }

  _pause () {
    this.props.dispatch({ type: 'PAUSE'});
  }
  _currentTrack () {
    this.props.dispatch({ type: 'GET_CURRENT_TRACK'});
  }
  render () {
    const {playing} = this.props.uiActions;
    const {title, artist, art} = this.props.firebase.currentTrack;
    return (
      <div className={StyleSheet.player}>
        <div className="player-current">
          <h2>{playing && 'playing'} {!playing && 'paused'}</h2>
          <div data-background={art} 
            className={classNames('turntable', 'vinyl', {
              'playing': playing
            })}
            onClick={::this._currentTrack}>
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
            <span className='fa fa-angle-right'/>
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
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlayerView);
