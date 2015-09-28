import React, {PropTypes, Component} from 'react';
import StyleSheet from '../styles/queue.styl';

export default class Queue extends Component {
  static propTypes = {
    playlist: PropTypes.array
  }
  render() {
    const {playlist} = this.props;
    const allTracks = playlist.map( track =>
        <tr>
          <td>{track.name}</td>
          <td>{track.artist}</td>
          <td>{track.album}</td>
        </tr>
    );
    return (
      <div className={StyleSheet.wrapper}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
            </tr>
          </thead>
          <tbody>
            {allTracks}
          </tbody>
        </table>
      </div>
    );
  }
}
