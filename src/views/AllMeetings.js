import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import * as actions from 'actions/ui';
import StyleSheet from 'styles/calendarView.styl';
import moment from 'moment';
import Kronos from 'react-kronos';

moment.locale('en', {
  calendar : {
    lastDay : '[yesterday]',
    sameDay : '[today as of] LT',
    nextDay : '[tomorrow as of] LT [today]',
    lastWeek : '[last] dddd [as of] LT [today]',
    nextWeek : 'dddd [as of] LT [today]',
    sameElse : 'L'
  }
});

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
    this.state = {
      date: Date.now()
    };
  }
  componentDidMount() {
    const {dispatch, ui} = this.props;
    const difference = moment(ui.lastRoomRequest).diff(moment(), 'minutes');
    if ((difference > 1) || (ui.allMeetings.length === 0)) {
      dispatch(actions.checkRooms(Date.now()));
    }
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
  changeDisplayDate(date) {
    const {dispatch} = this.props;
    this.setState({
      date: date
    });
    dispatch(actions.checkRooms({
      timeMin: moment(date).hour(9),
      timeMax: moment(date).hour(17)
    }));
  }
  renderMeetings(meetings) {
    return this.filterUnique(meetings.sort(this.sortMeetings)).map(meeting => {
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
    });
  }
  renderReAuth() {
    const {loading} = this.props.ui;
    return setTimeout(() => {
      if (loading) {
        return (
          <p>Please reauth</p>
        );
      }
    }, 5000);
  }
  render() {
    const {loading, dateLookup} = this.props.ui;
    return (
      <div className={StyleSheet.container}>
        <h3>All conference room reservations for {moment(this.state.date).calendar()}</h3>
        <h4>Change date:</h4>
        <Kronos
          onChange={::this.changeDisplayDate}
          returnAs={'ISO'}
          date={this.state.date} />
        {loading &&
          <p>Checking reservations. Gimme a sec.</p>
        }
        {(!loading && dateLookup.items) &&
          <div>{this.renderMeetings(dateLookup.items)}</div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(AllMeetings);
