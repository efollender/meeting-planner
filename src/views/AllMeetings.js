import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions/ui';
import StyleSheet from 'styles/allView.styl';
import moment from 'moment';
import Kronos from 'react-kronos';
import AgendaChart from 'components/AgendaChart';

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
    const hours = [];
    for (let i = 8; i < 19; i++) hours.push(i);
    return (
      <div className={StyleSheet.calendar}>
        <div className="agenda-header">
          <h3>All conference room reservations for {moment(this.state.date).calendar()}</h3>
          <h4>Change date:</h4>
          <Kronos
            onChange={::this.changeDisplayDate}
            returnAs={'ISO'}
            date={this.state.date} />
          {loading &&
            <p>Checking reservations. Gimme a sec.</p>
          }
        </div>
        {(!loading && dateLookup.items) &&
          <div className="chart-container">
            <div className="y-axis">
              {hours.map(hour=>{
                return <span>{hour}</span>;
              })}
            </div>
            <div className="agenda-container">
              {Object.keys(dateLookup.items).map(room => {
                return (
                  <AgendaChart
                    key={`room-${room}`}
                    roomName={room}
                    currentDate={this.state.date}
                    items={this.filterUnique(dateLookup.items[room].sort(this.sortMeetings))} />
                );
              })}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(AllMeetings);
