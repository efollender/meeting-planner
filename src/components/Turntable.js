import React, {Component, PropTypes} from 'react';
import classNames from 'classNames';

export default class Turntable extends Component {
  static propTypes = {
    playing: PropTypes.bool,
    current: PropTypes.object,
    play: PropTypes.func,
    pause: PropTypes.func,
    nextTrack: PropTypes.func,
    dispatch: PropTypes.func
  }
  render() {
    const {playing, current} = this.props;
    const {title, artist, art} = current;
    return (
      <div>
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
              <span className='fa fa-play' onClick={::this.props.play}/>
            }
            {playing &&
              <span className='fa fa-pause' onClick={::this.props.pause}/>
            }
            <span className='fa fa-angle-right' onClick={::this.props.nextTrack} />
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
