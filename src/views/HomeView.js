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
  renderAttendees(attendees) {
    return attendees.map( person => {
      if (person.displayName) {
        if (person.displayName.split(' ').length > 1) {
          return <span>{person.displayName}<br/></span>;
        }
      }
    });
  }
  renderRoomStatus() {
    const {roomStatus} = this.props.ui;
    return Object.keys(roomStatus).map(room => {
      return (
        <div className={classNames('room', {
          available: !roomStatus[room].taken,
          occupied: roomStatus[room].taken
        })} data-room={roomStatus[room].name}>
          {roomStatus[room].details &&
            <p>
              {roomStatus[room].details.name}<br/><br/>
              {this.renderAttendees(roomStatus[room].details.attendees)}
            </p>
          }
        </div>
      );
    });
  }
  render () {
    const {loggedIn} = this.props.ui;
    return (
      <div className="home-container">
        {loggedIn &&
          <div className="current-status">
            <h3>Current room status</h3>
            {this.renderRoomStatus()}
          </div>
        }
      </div>
    );
  }
}
export default connect(mapStateToProps)(HomeView);
