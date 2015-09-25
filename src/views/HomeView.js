import React       from 'react';

export default class HomeView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func
  }

  constructor () {
    super();
  }
  render () {
    return (
      <div className='container text-center'>
        <h1>Welcome to the React Redux Starter Kit</h1>
      </div>
    );
  }
}
