import React, {Component, PropTypes}       from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import * as actions from 'actions/ui';

const mapStateToProps = (state) => ({
  ui : state.ui
});
class HomeView extends Component {
  static propTypes = {
    ui: PropTypes.object,
    dispatch: PropTypes.func
  }
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(actions.checkRooms());
  }
  render () {
    const {loggedIn, roomStatus} = this.props.ui;
    return (
      <div className="home-container">
        {loggedIn &&
          <div className="current-status">
            <h3>Current room status</h3>
            <div className={classNames('room', {
              available: !roomStatus.lounge.taken,
              occupied: roomStatus.lounge.taken
            })} data-room="Lounge" />
            <div className={classNames('room', {
              available: !roomStatus.smalls.taken,
              occupied: roomStatus.smalls.taken
            })} data-room="Smalls" />
            <div className={classNames('room', {
              available: !roomStatus.biggie.taken,
              occupied: roomStatus.biggie.taken
            })} data-room="Biggie" />
          </div>
        }
      </div>
    );
  }
}
export default connect(mapStateToProps)(HomeView);
