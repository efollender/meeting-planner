import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import * as uiActions from 'actions/ui';
import StyleSheet from 'styles/calendarView.styl';
import moment from 'moment';

const mapStateToProps = (state) => ({
  ui : state.ui
});

class CalendarView extends Component {
  static propTypes = {
    ui: PropTypes.object,
    dispatch: PropTypes.func
  }
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(uiActions.getSchedule());
  }
  shouldComponentUpdate(props) {
    const {ui} = this.props;
    return ((ui.session !== props.ui.session) || (ui.schedule !== props.ui.schedule));
  }
  renderError() {
    if (this.props.ui.schedule.hasOwnProperty('error')) {
      return (
        <div>
          <p>Your session has been timed out. Please login again.</p>
          <button
            onClick={()=>this.props.dispatch(uiActions.signIn())}>
            Re-authorize
          </button>
        </div>
      );
    }
  }
  renderAttendees(attendees) {
    return attendees.map( person => {
      if (person.displayName) {
        if (person.displayName.split(' ').length > 1) {
          return <p  className="attendee" key={person.email + Math.random().toString()}>{person.displayName}</p>;
        }
      }
    });
  }
  render () {
    const {schedule} = this.props.ui;
    const error = schedule.hasOwnProperty('error');
    return (
      <div className={StyleSheet.container}>
        <h3>Your upcoming week</h3>
        {this.renderError()}
        {(schedule && !error) &&
          <div className="schedule-container">
           {schedule.map((el, index) => {
             if (el.summary) {
               return (
                <div className="calendar-event" key={index}>
                  <h5>{el.summary}</h5>
                  {el.start &&
                    <p>{moment(el.start.dateTime).format('MMM D, YYYY h:mm a')}</p>
                  }
                  {el.attendees &&
                    <div>{this.renderAttendees(el.attendees)}</div>
                  }
                  <p>{el.location}</p>
                </div>
               );
             }
           })}
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(CalendarView);
