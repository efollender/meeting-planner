import React       from 'react';
import StyleSheet from 'styles/reserveView.styl';
import Kronos from 'react-kronos';

// const mapStateToProps = (state) => ({
//   ui : state.ui
// });
export default class ReserveView extends React.Component {
  constructor () {
    super();
  }

  render () {
    // const {session, loggedIn} = this.props.ui;
    return (
      <div className={StyleSheet.container}>
        <form>
          <h4><span className="fa fa-map-marker"/>Pick a room</h4>
          <div className="room-choices">
            <label htmlFor="biggie">
              <input type="radio" name="which-room" id="biggie" value="biggie"/>
              <span>Biggie</span>
            </label>
            <label htmlFor="smalls">
              <input type="radio" name="which-room" id="smalls" value="smalls"/>
              <span>Smalls</span>
            </label>
            <label htmlFor="lounge">
              <input type="radio" name="which-room" id="lounge" value="lounge"/>
              <span>Lounge</span>
            </label>
          </div>
          <h4><span className="fa fa-clock-o"/>What time?</h4>
          <div className="datepicker">
            <Kronos date={Date.now()} />
          </div>
        </form>
      </div>
    );
  }
}


