import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';

export default class Search extends Component {
  static propTypes = {
    submitQuery: PropTypes.func
  }
  _handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      const query = findDOMNode(this.refs.searchQuery).value;
      this.props.submitQuery(query);
    }
  }
  render() {
    return (
      <form>
        <input
          onKeyDown={::this._handleKeyDown}
          type="text"
          placeholder="Search for a track"
          ref="searchQuery"/>
      </form>
    );
  }
}
