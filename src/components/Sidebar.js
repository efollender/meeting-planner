import React, {PropTypes, Component} from 'react';
// import {findDOMNode} from 'react-dom';
import StyleSheet from 'styles/sidebar.styl';

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
          {session.userName &&
            <h3>Hi, {session.userName}!</h3>
          }
          {session.userImage &&
            <img src={session.userImage}/>
          }
        </div>
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
      </div>
    );
  }
}
