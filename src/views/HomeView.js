import React       from 'react';
import { connect } from 'react-redux';
import * as uiActions from 'actions/ui';

// We define mapStateToProps where we'd normally use the @connect
// decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  ui : state.ui
});
export class HomeView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    ui  : React.PropTypes.object
  }

  constructor () {
    super();
  }
  _signIn (e) {
    e.preventDefault();
    this.props.dispatch(uiActions.signIn());
  }
  // normally you'd import an action creator, but I don't want to create
  // a file that you're just going to delete anyways!

  render () {
    const {session} = this.props.ui;
    return (
      <div className='container text-center'>
        <h1>Brooklyn United Meeting Command Center</h1>
        <h2>Login with your BU email</h2>
        <form>
          <button onClick={::this._signIn}>Sign in with Google</button>
          {session.userName &&
            <h3>Hi, {session.userName}!</h3>
          }
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomeView);
