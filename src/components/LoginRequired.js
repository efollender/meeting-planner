import React, {Component, PropTypes} from 'react';
// import

export default class LoginRequired extends Component {
  static propTypes = {
    signIn: PropTypes.func
  }
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form>
        <h2>Login with your BU email</h2>
        <button onClick={this.props.signIn}>Sign in with Google</button>
      </form>
    );
  }
}
