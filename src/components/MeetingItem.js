import React, {PropTypes, Component} from 'react';
import moment from 'moment';
import classNames from 'classnames';

export default class MeetingItem extends Component {
  static propTypes = {
    location: PropTypes.string,
    summary: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
    attendees: PropTypes.array,
    id: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {expanded: false};
  }
  toggleCard() {
    this.setState({expanded: !this.state.expanded});
  }
  renderAttendees(attendees) {
    return attendees.map( person => {
      if (person.displayName) {
        if (person.displayName.split(' ').length > 1) {
      // let headshot = 'http://www.brooklynunited.com/images/brooklyn-united-header-gear.gif';
      // fbUtils.getUserImage(person, res => {
      //   headshot = res;
      // });
          return (
            <p className="attendee" key={person.email + Math.random().toString()}>{person.displayName}</p>
            // <img
            //   className="attendee"
            //   src={headshot}
            //   key={person.email + Math.random().toString()} />
          );
        }
      }
    });
  }
  render() {
    const {location, summary, start, end, attendees} = this.props;
    let meetingLoc = '';
    if (location) meetingLoc = location.toLowerCase();
    return (
      <div className={classNames({
        expanded: this.state.expanded,
        collapsed: !this.state.expanded
      })} onClick={::this.toggleCard}>
        <div
          className={classNames('calendar-event', {
            [meetingLoc]: location
          })}>
          <h5>{summary}</h5>
          {(start && start.dateTime) &&
            <p>
              {moment(start.dateTime).format('MMM D, YYYY h:mm a') + ' - '}
              {moment(end.dateTime).format('h:mm a')}
            </p>
          }
          {(start && start.date) &&
            <p>
              {moment(start.date).format('MMM D, YYYY')}
              <br/>
              All day
            </p>
          }
          {attendees &&
            <div>{this.renderAttendees(attendees)}</div>
          }
          {location &&
            <p>{location}</p>
          }
        </div>
        {/* <div
          className={classNames('calendar-event', 'clone', {
            [meetingLoc]: location,
            expanded: this.state.expanded
          })}>
          <h5>{summary}</h5>
          {start &&
            <p>
              {moment(start.dateTime).format('MMM D, YYYY h:mm a') + ' - '}
              {moment(end.dateTime).format('h:mm a')}
            </p>
          }
          {attendees &&
            <div>{this.renderAttendees(attendees)}</div>
          }
          <p>{location}</p>
        </div> */}
      </div>
    );
  }
}
