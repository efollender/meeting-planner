import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import * as actions from 'actions/ui';
import StyleSheet from 'styles/calendarView.styl';
import moment from 'moment';

const mapStateToProps = (state) => ({
  ui : state.ui
});

class AllMeetings extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    ui: PropTypes.object
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (!this.props.ui.allMeetings.length) this.props.dispatch(actions.checkRooms());
  }
  filterUnique(meetings) {
    const meetingIDs = [];
    const uniqueMeetings = [];
    meetings.map(meeting => {
      if (meetingIDs.indexOf(meeting.id) === -1) {
        meetingIDs.push(meeting.id);
        uniqueMeetings.push(meeting);
      }
    });
    return uniqueMeetings;
  }
  sortMeetings(a, b) {
    if (!a.start || !b.start) return false;
    return Date.parse(a.start.dateTime) - Date.parse(b.start.dateTime);
  }
  render() {
    const {allMeetings} = this.props.ui;
    return (
      <div className={StyleSheet.container}>
        <h3>All conference room reservations today</h3>
        {this.filterUnique(allMeetings.sort(this.sortMeetings)).map(meeting => {
          return (
            <div key={meeting.id}
              className={classNames(meeting.location.toLowerCase(), 'calendar-event')}>
              <h5>{meeting.summary}</h5>
              {meeting.start &&
                <p className='meeting-time'>{moment(meeting.start.dateTime).format('h:mm a')}</p>
              }
              {meeting.end &&
                <p className='meeting-time'> - {moment(meeting.end.dateTime).format('h:mm a')}</p>
              }
              <p>{meeting.location}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect(mapStateToProps)(AllMeetings);
