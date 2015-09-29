import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';

export default class Search extends Component {
  static propTypes = {
    submitQuery: PropTypes.func,
    results: PropTypes.array,
    addTrack: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }
  _handleKeyDown(e) {
    const query = findDOMNode(this.refs.searchQuery).value;
    this.setState({query: query});
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.submitQuery(query);
      findDOMNode(this.refs.searchQuery).value = '';
    }
  }
  _addTrack(el) {
    this.setState({query: ''});
    this.props.addTrack(el);
  }
  render() {
    const {results} = this.props;
    return (
      <div>
        <form>
          <input
            onKeyDown={::this._handleKeyDown}
            type="text"
            placeholder="Search for a track"
            ref="searchQuery"/>
        </form>
        {(results && this.state.query.length > 1) &&
          results.map( el =>
            <p key={el.id} className="track-list" onClick={this._addTrack.bind(this, el)}>{el.name}</p>
          )
        }
      </div>
    );
  }
}
