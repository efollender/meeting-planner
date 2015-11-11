import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as uiActions from 'actions/ui';
import StyleSheet from 'styles/calendarView.styl';
import moment from 'moment';
import MeetingItem from 'components/MeetingItem';

const mapStateToProps = (state) => ({
  ui : state.ui,
  auth: state.auth
});

class CalendarView extends Component {
  static propTypes = {
    ui: PropTypes.object,
    auth: PropTypes.object,
    dispatch: PropTypes.func
  }
  constructor (props) {
    super(props);
    this.state = {
      activeGroup: 'confirmed',
      awaitingCount: 0
    };
  }
  componentDidMount() {
    const {dispatch, ui} = this.props;
    const difference = moment(ui.lastScheduleRequest).diff(moment(), 'minutes');
    if ((difference > 1) || (ui.schedule.length === 0)) { dispatch(uiActions.getSchedule()); }
  }
  // shouldComponentUpdate(props) {
  //   const {auth, ui} = this.props;
  //   return ((auth.session !== props.auth.session) || (ui.schedule !== props.ui.schedule));
  // }
  changeActive(status) {
    this.setState({
      activeGroup: status
    });
  }
  increment() {
    this.setState({
      awaitingCount: this.state.awaitingCount++
    });
  }
  render () {
    const {schedule} = this.props.ui;
    const {activeGroup, awaitingCount} = this.state;
    const error = schedule.hasOwnProperty('error');
    return (
      <div className={StyleSheet.container}>
        <div className="tabs-container">
          <h3
            onClick={this.changeActive.bind(this, 'confirmed')}
            className={classNames({
              active: (activeGroup === 'confirmed')
            })}>
            Your upcoming week</h3>
          <h3
            onClick={this.changeActive.bind(this, 'awaiting')}
            className={classNames({
              active: (activeGroup === 'awaiting')
            })}>
            Awaiting response ({awaitingCount}) </h3>
          <h3
            onClick={this.changeActive.bind(this, 'declined')}
            className={classNames({
              active: (activeGroup === 'declined')
            })}>
            Declined</h3>
        </div>
        {(schedule && !error) &&
          <div className="schedule-container">
           {schedule.map((el) => {
             if (el.status === activeGroup) {
               if (activeGroup === 'awaiting') this.increment();
               return <MeetingItem {...el} key={el.id}/>;
             }
           })}
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(CalendarView);
