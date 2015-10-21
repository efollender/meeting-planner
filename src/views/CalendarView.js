import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import * as uiActions from 'actions/ui';
import StyleSheet from 'styles/calendarView.styl';
import moment from 'moment';
import MeetingItem from 'components/MeetingItem';

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
    const {dispatch, ui} = this.props;
    const difference = moment(ui.lastScheduleRequest).diff(moment(), 'minutes');
    if ((difference > 1) || (ui.schedule.length === 0)) { dispatch(uiActions.getSchedule()); }
  }
  shouldComponentUpdate(props) {
    const {ui} = this.props;
    return ((ui.session !== props.ui.session) || (ui.schedule !== props.ui.schedule));
  }
  renderError() {
    if (this.props.ui.schedule.hasOwnProperty('error')) {
      return (
        <div>
          <p>Your session has timed out. Please login again.</p>
          <button
            onClick={()=>this.props.dispatch(uiActions.signIn())}>
            Re-authorize
          </button>
        </div>
      );
    }
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
           {schedule.map((el) => {
             return <MeetingItem {...el} key={el.id}/>;
           })}
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(CalendarView);
