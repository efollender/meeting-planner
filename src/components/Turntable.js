import React, {Component, PropTypes} from 'react';
import classNames from 'classNames';

export default class Turntable extends Component {
  static propTypes = {
    paused: PropTypes.bool,
    current: PropTypes.object,
    playlist: PropTypes.array,
    play: PropTypes.func,
    pause: PropTypes.func,
    nextTrack: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      updating: false
    };
  }
  _changeRecord() {
    this.setState({updating:true});
    setTimeout(()=>{
      this.setState({
        updating: false,
        newRecord: this.props.playlist[0].art
      });
      this.props.nextTrack();
    }, 3000);
  }
  render() {
    const {paused, current, playlist} = this.props;
    const {name, artist, art} = current;
    const next = playlist[0] || {name: 'none', artist: 'none'};
    return (
      <div className={classNames({'changing-track': this.state.updating})}>
        <div className="player-current">
          <h2>{!paused && 'playing'} {paused && 'paused'}</h2>
          <div
            className={classNames('turntable', 'vinyl', {
              'playing': !paused
            })}>
            <div className="turntable-inner" style={{backgroundImage:`url(${art})`}} />
          </div>
          {this.state.newRecord &&
            <div
            className={classNames('turntable', 'vinyl', {
              'playing': !paused
            })}>
              <div
                className="turntable-inner"
                style={{backgroundImage:`url(${this.state.newRecord})`}}
                />
            </div>
          }
          <div className="needle-wrapper">
            <img src="assets/player_needle.svg"/>
          </div>
          <div className="track-info">
            <p className="track-title">
            {name}
            </p>
            <p className="track-artist">
              {artist}
            </p>
          </div>
          <div className="player-controls">
            <span className='fa fa-angle-left'/>
            {paused &&
              <span className='fa fa-play' onClick={this.props.play}/>
            }
            {!paused &&
              <span className='fa fa-pause' onClick={this.props.pause}/>
            }
            <span className='fa fa-angle-right' onClick={::this._changeRecord} />
          </div>
        </div>
        <div className="player-next">
          <p className="next-label">Next</p>
          <p className="next-track-title">
            {next.name}
          </p>
          <p className="next-track-artist">
            {next.artist}
          </p>
        </div>
      </div>
    );
  }
}
