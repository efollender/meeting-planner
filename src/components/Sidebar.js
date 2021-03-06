import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import StyleSheet from 'styles/sidebar.styl';
import moment from 'moment';
import ReactFitText from 'react-fittext';
import * as actions from 'actions/ui';

export default class Sidebar extends Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    session: PropTypes.object,
    message: PropTypes.object,
    signIn: PropTypes.func,
    signOut: PropTypes.func,
    history: PropTypes.object,
    roomStatus: PropTypes.object,
    dispatch: PropTypes.func,
    lastRoomRequest: PropTypes.number
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setInterval(this.props.dispatch(actions.checkRooms()), 1000);
  }
  renderDate() {
    const month = moment().format('MMMM');
    const day = moment().format('DD');
    return (
      <div
        onClick={()=>history.pushState({...this.props}, '/')}
        className="sidebar-date">
        <ReactFitText compressor={1.5}>
          <span className="month">{month}</span>
        </ReactFitText>
        <ReactFitText compressor={-0.5}>
          <span className="day">{day}</span>
        </ReactFitText>
      </div>
    );
  }
  renderRoomStatus() {
    const {roomStatus} = this.props;
    if (roomStatus) {
      return Object.keys(roomStatus).map(room => {
        return (
          <tr className={classNames('room', {
            available: !roomStatus[room].taken,
            occupied: roomStatus[room].taken
          })}
            key={`sidebar-${room}`}
            data-room={roomStatus[room].name}>
            <td>{roomStatus[room].name}</td>
            <td className="availability">
              {roomStatus[room].taken &&
                <p>Not available</p>
              }
              {!roomStatus[room].taken &&
                <p>Available</p>
              }
            </td>
          </tr>
        );
      });
    }
  }
  render() {
    const {session, history, lastRoomRequest} = this.props;
    return (
      <div className={StyleSheet.container}>
        <div className="main-nav">
          <div className="current-user">
            {session.userImage &&
              <div
              style={{
                backgroundImage: `url(${session.userImage}`
              }}
              className="profile-img"
              />
            }
            <div className="welcome">
              <h3>BU Rooms</h3>
              {session.userName &&
                <p>Hi, {session.userName}!</p>
              }
            </div>
          </div>
          {this.renderDate()}
          <ul>
            <li onClick={()=>history.pushState({...this.props}, '/schedule')}>
              <a>
                <span className="fa fa-calendar"/>Your Schedule
              </a>
            </li>
            <li onClick={()=>history.pushState({...this.props}, '/reserve')}>
              <a>
                <span className="fa fa-calendar-plus-o"/>
                Reserve a room
              </a>
            </li>
            <li onClick={()=>history.pushState({...this.props}, '/all')}>
              <a>
                <span className="fa fa-bars"/>Reservation Schedule
              </a>
            </li>
            <li onClick={this.props.signOut}>
              <a>
                <span className="fa fa-sign-out"/>
                Log out
              </a>
            </li>
          </ul>
        </div>
          <table className="sidebar-availability">
            <tbody>
              {this.renderRoomStatus()}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">
                  <h5>AVAILABILITY</h5>
                  <h6>Today as of {moment(lastRoomRequest).format('h:mma')}</h6>
                </td>
              </tr>
            </tfoot>
          </table>
      </div>
    );
  }
}
