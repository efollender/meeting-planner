import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import 'styles/core.scss';
import 'styles/core.styl';
import Sidebar from 'components/Sidebar';
import LoginRequired from 'components/LoginRequired';
import * as uiActions from 'actions/ui';

const mapStateToProps = (state) => ({
  ui : state.ui
});

class CoreLayout extends Component {

  static propTypes = {
    dispatch : PropTypes.func,
    ui       : PropTypes.object,
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
    this.props.dispatch(uiActions.signIn());
  }
  _signOut (e) {
    e.preventDefault();
    this.props.dispatch(uiActions.logOut());
    this.props.history.pushState(null, '/');
  }
  render () {
    const {history, ui, children} = this.props;
    return (
      <div className='page-container'>
        <div className='view-container'>
          {!ui.loggedIn &&
            <LoginRequired/>
          }
          {ui.loggedIn &&
            <div>
              <Sidebar {...ui}
                dispatch={::this.props.dispatch}
                history={history}
                signOut={::this._signOut}
                signIn={::this._signIn} />
              <div className="main-content text-center">
                <h1 onClick={()=>history.pushState(null, '/')}>BU Meeting Planner</h1>
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
