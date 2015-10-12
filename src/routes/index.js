import { Route }   from 'react-router';
import React       from 'react';
import CoreLayout  from 'layouts/CoreLayout';
import HomeView    from 'views/HomeView';
import ReserveView from 'views/ReserveView';
import CalendarView from 'views/CalendarView';

export default (
  <Route component={CoreLayout}>
    <Route path='/' component={HomeView} />
    <Route path='reserve' component={ReserveView} />
    <Route path='schedule' component={CalendarView} />
  </Route>
);
