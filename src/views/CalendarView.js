import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import * as uiActions from 'actions/ui';
import StyleSheet from 'styles/calendarView.styl';

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
  renderDateString(dateString) {
    return (new Date(dateString)).toDateString();
  }
  render () {
    const {schedule} = this.props.ui;
    return (
      <div className={StyleSheet.container}>
        <h3>Calendar</h3>
        {schedule &&
          <div className="schedule-container">
           {schedule.map((el, index) => {
             if (el.summary) {
               return (
                <div className="calendar-event" key={index}>
                  <h5>{el.summary}</h5>
                  {el.start &&
                    <p>{this.renderDateString(el.start.dateTime)}</p>
                  }
                  {el.attendees.map(person => {
                    return <p key={person.id + Math.random().toString()}>{person.displayName}</p>;
                  })}
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
