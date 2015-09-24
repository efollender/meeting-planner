import { Route }   from 'react-router';
import React       from 'react';
import CoreLayout  from 'layouts/CoreLayout';
import HomeView    from 'views/HomeView';
import playerView  from 'views/playerView';

export default (
  <Route component={CoreLayout}>
    <Route name='home' path='/' component={HomeView} />
    <Route path='/player' component={playerView} />
  </Route>
);
