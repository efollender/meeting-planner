import React, {Component, PropTypes}      from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import StyleSheet from 'styles/reserveView.styl';
import Kronos from 'react-kronos';
import moment from 'moment';
import * as actions from 'actions/ui';
// import * as fbUtils from 'utils/firebaseUtils';

const mapStateToProps = (state) => ({
  ui : state.ui
});

class ReserveView extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    ui: PropTypes.object
  }
  constructor (props) {
    super(props);
    this.state = {
      date: moment(),
      time: moment().hour(9).minute(0),
      attendees: [],
      showUsers: false
    };
  }
  toggleUsers() {
    const {dispatch, ui} = this.props;
    if (!ui.userList) dispatch(actions.getUserList());
    this.setState({
      showUsers: !this.state.showUsers
    });
  }
  changeDate(date) {
    this.setState({
      date: date
    });
  }
  checkAvailability(time) {
    this.setState({
      time: time
    });
    const {dispatch} = this.props;
    const hour = time.hour();
    const minute = time.minute();
    dispatch(actions.getAvailability(this.state.date.hour(hour).minute(minute).format()));
  }
  addAttendee(person) {
    const {attendees} = this.state;
    this.setState({
      attendees: attendees.concat(person)
    });
  }
  removeAttendee(person) {
    const {attendees} = this.state;
    const location = attendees.indexOf(person);
    attendees.splice(location, 1);
    this.setState({
      attendees: attendees
    });
  }
  renderAvailability() {
    const {availability} = this.props.ui;
    return Object.keys(availability).map((room, key) => {
      const theRoom = availability[room];
      return (
        <label
          className={classNames({
            disabled: theRoom.taken
          })}
          htmlFor={theRoom.name}
          key={key}>
          <input
            disabled={theRoom.taken}
            type="radio"
            name="which-room"
            id={theRoom.name}
            value={theRoom.name} />
          <span>{theRoom.name.toUpperCase()}</span>
        </label>
      );
    });
  }
  renderAddedAttendees(userList) {
    return userList.map(user => {
      return (
        <p
          onClick={this.removeAttendee.bind(this, user)}
          key={user.id}>
          {user.name}
        </p>
      );
    });
  }
  renderAttendeeModal(userList) {
    const {attendees} = this.state;
    return userList.map(user => {
      const userIndex = attendees.indexOf(user);
      if (userIndex < 0) {
        return (
          <p
            onClick={this.addAttendee.bind(this, user)}
            key={user.id}>
            {user.name}
          </p>
        );
      }
    });
  }
  render () {
    const {userList} = this.props.ui;
    const {showUsers} = this.state;
    return (
      <div className={StyleSheet.container}>
        <form>
          <h4><span className="fa fa-clock-o"/>Pick a date and time</h4>
          <div className="datepicker">
            <Kronos date={this.state.date} onChange={::this.changeDate} />
            <Kronos time={this.state.time} onChange={::this.checkAvailability} />
          </div>
          <h4><span className="fa fa-map-marker"/>Pick a room</h4>
          <div className="room-choices">
            {this.renderAvailability()}
          </div>
          <div className="new-meeting-title">
            <h4><span className="fa fa-pencil"/>What's this about? (event title)</h4>
            <input type="text" id="new-meeting-title"/>
          </div>
          <div className=" ">
            <h4><span className="fa fa-list"/>Tell me more. (event description)</h4>
            <textarea/>
          </div>
          <div className="add-attendees">
            <h4><span className="fa fa-user"/>Add some folks</h4>
            {this.state.attendees &&
              <div className="user-modal attendees">
                {this.renderAddedAttendees(this.state.attendees)}
              </div>
            }
            <span
              onClick={::this.toggleUsers}
              className="fa fa-plus" />
            {(userList && showUsers) &&
              <div className="user-modal">
                {this.renderAttendeeModal(userList)}
              </div>
            }
            <input type="text"/>
            <h5>Chill. I'm still working on this.</h5>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ReserveView);
