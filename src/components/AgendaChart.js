import React, {PropTypes, Component} from 'react';
import moment from 'moment';
import StyleSheet from 'styles/agenda.styl';

export default class AgendaChart extends Component {
  static propTypes = {
    items: PropTypes.array,
    currentDate: PropTypes.number,
    roomName: PropTypes.string
  }
  render() {
    const start = moment().hour(8).minutes(0);
    const {currentDate, items, roomName} = this.props;
    let currTime;
    if (moment(currentDate).isSame(moment(), 'day')) {
      currTime = moment().diff(start, 'hours', true);
    }
    return (
      <div className={StyleSheet.container}>
        <div className="room-header biggie">
          <span className="room-title">
            {roomName}
          </span>
        </div>
        <div className="content-container">
          {(currTime > 0) &&
            <div
              className="current-time"
              style={{
                top: `${currTime * 10}%`
              }}/>
          }
          {items.map(item => {
            const morning = moment(currentDate).hour(8).minutes(0);
            const fromTop = moment(item.start.dateTime).diff(morning, 'hours', true);
            const fromBottom = moment(item.end.dateTime).diff(item.start.dateTime, 'hours', true);
            return (
              <div
                key={`agenda-${item.id}`}
                className="agenda-item"
                style={{
                  top: `${(fromTop * 10)}%`,
                  height: `${(fromBottom * 10)}%`
                }}>
                <p className="content">
                  {item.summary} <br/>
                  {moment(item.start.dateTime).format('h:mm ')}-
                  {moment(item.end.dateTime).format(' h:mm')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

