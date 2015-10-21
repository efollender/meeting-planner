import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import StyleSheet from 'styles/sidebar.styl';
import moment from 'moment';

export default class Sidebar extends Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    session: PropTypes.object,
    message: PropTypes.object,
    signIn: PropTypes.func,
    signOut: PropTypes.func,
    history: PropTypes.object
  }
  constructor(props) {
    super(props);
  }
  renderDate() {
    const month = moment().format('MMMM');
    const day = moment().format('DD');
    return (
      <div className="sidebar-date">
        <span className="month">{month}</span>
        <span className="day">{day}</span>
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
          })} data-room={roomStatus[room].name}>
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
    const {loggedIn, session, history} = this.props;
    return (
      <div className={StyleSheet.container}>
        {!loggedIn &&
        <form>
          <h2>Login with your BU email</h2>
          <button onClick={this.props.signIn}>Sign in with Google</button>
        </form>
        }
        <div className="current-user">
          {session.userImage &&
            <img src={session.userImage}/>
          }
          <div className="welcome">
            <h3>BU Rooms</h3>
            {session.userName &&
              <p>Hi, {session.userName}!</p>
            }
          </div>
        </div>
        {this.renderDate()}
        <div className="main-nav">
          {loggedIn &&
          <ul>
            <li onClick={()=>history.pushState(null, '/schedule')}>
              <a>
                <span className="fa fa-calendar"/>Your Schedule
              </a>
            </li>
            <li onClick={()=>history.pushState(null, '/reserve')}>
              <a>
                <span className="fa fa-calendar-plus-o"/>
                Reserve a room
              </a>
            </li>
            <li onClick={()=>history.pushState(null, '/all')}>
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
          }
        </div>
        {loggedIn &&
          <table className="sidebar-availability">
            <tbody>
              {this.renderRoomStatus()}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">
                  Availability as of
                </td>
              </tr>
            </tfoot>
          </table>
        }
      </div>
    );
  }
}
