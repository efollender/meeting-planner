import React, {Component, PropTypes}       from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import moment from 'moment';
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
    const {roomStatus, session} = this.props.ui;
    return Object.keys(roomStatus).map(room => {
      let attendees = false;
      if (roomStatus[room].details) {
        roomStatus[room].details.attendees.map( person => {
          if (person.displayName === session.userName) {
            attendees = true;
          }
        });
      }
      return (
        <div className={classNames('room', {
          alertMeeting: attendees,
          available: !roomStatus[room].taken,
          occupied: roomStatus[room].taken
        })} data-room={roomStatus[room].name}>
          {roomStatus[room].details &&
            <p>
              <strong>
                {roomStatus[room].details.name}
              </strong><br/>
              {moment(roomStatus[room].details.start).format('h:mm') +
                ' - ' +
                moment(roomStatus[room].details.end).format('h:mm')}
              <br/><br/>
              {this.renderAttendees(roomStatus[room].details.attendees)}
            </p>
          }
        </div>
      );
    });
  }
  render () {
    const {loggedIn, lastRoomRequest} = this.props.ui;
    return (
      <div className="home-container">
        {loggedIn &&
          <div className="current-status">
            <h3>Room status {moment(lastRoomRequest).calendar()}</h3>
            {this.renderRoomStatus()}
          </div>
        }
      </div>
    );
  }
}
export default connect(mapStateToProps)(HomeView);
