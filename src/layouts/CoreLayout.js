import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import 'styles/core.scss';
import 'styles/core.styl';
import Sidebar from 'components/Sidebar';
import LoginRequired from 'components/LoginRequired';
// import * as uiActions from 'actions/ui';
import * as authActions from 'actions/AuthActions';

const mapStateToProps = (state) => ({
  ui : state.ui,
  auth : state.auth
});

class CoreLayout extends Component {

  static propTypes = {
    dispatch : PropTypes.func,
    ui       : PropTypes.object,
    auth: PropTypes.object,
    children : PropTypes.element,
    history  : PropTypes.object
  }
  static contextTypes = {
    store: PropTypes.object
  }
  constructor (props, context) {
    super(props, context);
  }
  _signIn (e) {
    e.preventDefault();
    this.props.dispatch(authActions.signIn());
  }
  _signOut (e) {
    e.preventDefault();
    this.props.dispatch(authActions.logOut());
    this.props.history.pushState(null, '/');
  }
  render () {
    const {history, ui, children, auth} = this.props;
    const {loggedIn} = auth;
    return (
      <div className='page-container'>
        <div className='view-container'>
          {!loggedIn &&
            <LoginRequired
              signIn={::this._signIn}
            />
          }
          {loggedIn &&
            <div>
              <Sidebar {...ui} {...auth}
                dispatch={::this.props.dispatch}
                history={history}
                signOut={::this._signOut}
                signIn={::this._signIn} />
              <div className="main-content text-center">
                <div className="utility-bar"/>
                {children}
              </div>
            </div>
            }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CoreLayout);
