import Firebase from 'firebase';
import creds from '../../lib/creds';
import axios from 'axios';

const FBRef = new Firebase(creds.firebase);
const today = new Date();
const theDay = today.getDate();
const theMonth = today.getMonth();
const theYear = today.getFullYear();

const roomStatus = {
  biggie: {
    name: 'biggie',
    taken: false
  },
  smalls: {
    name: 'smalls',
    taken: false
  },
  lounge: {
    name: 'lounge',
    taken: false
  }
};

function checkDomain(email) {
  const re = /(@brooklynunited.com)/;
  if (re.test(email)) return true;
  return false;
}

function whichRoom(location) {
  let response = null;
  Object.keys(roomStatus).map( room => {
    // const reg = new RegExp('(' + room + ')', 'g');
    // console.log('the ex', room);
    if ((location.toLowerCase()).search(room) > -1) response = room;
  });
  return response;
}

export function getSchedule(data, cb) {
  const token = encodeURIComponent(data);
  const theDate = (new Date()).toISOString();
  const timeMax = (new Date(theYear, theMonth, theDay + 7, 17, 0, 0)).toISOString();
  axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${token}&timeMin=${theDate}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`)
    .then((res) => {
      cb(res.data.items);
    })
    .catch((error) => {
      console.log('an error occured', error);
      if (error.hasOwnProperty('data')) cb({error: error.data.error.code});
    });
}

export function getTodayEvents(data, cb) {
  const {calendarID, token, room} = data;
  const todayam = (new Date(theYear, theMonth, theDay, 9, 0, 0)).toISOString();
  const todaypm = (new Date(theYear, theMonth, theDay, 17, 0, 0)).toISOString();
  room.map(rooms => {
    axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?access_token=${token}&timeMin=${todayam}&timeMax=${todaypm}&q=${rooms}&singleEvents=true`)
    .then(eventList => {
      if (eventList.data.items.length > 0) {
        eventList.data.items.map((event) => {
          cb(event);
        });
      }
    });
  });
}

export function getCalendars(data) {
  const token = encodeURIComponent(data);
  return FBRef.child('meetingplanner/calendars').once('value', snapshot => {
    if (snapshot.val()) return snapshot.val();
    return axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${token}&fields=items%2Fid`)
      .then(res => {
        return res.data.items;
      });
  });
}

export function checkRooms(data, cb) {
  const token = encodeURIComponent(data);
  const currently = Date.parse(new Date());
  const rooms = ['biggie', 'smalls', 'lounge'];
  const allMeetings = [];
  axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${token}&fields=items%2Fid`)
    .then(res => {
      res.data.items.map(item => {
        const currentItem = item;
        const calendarID = encodeURIComponent(currentItem.id);
        const calData = {
          calendarID: calendarID,
          token: token,
          room: rooms
        };
        getTodayEvents(calData, event => {
          allMeetings.push(event);
          const {start, end} = event;
          if ( start.dateTime && end.dateTime) {
            if ((Date.parse(start.dateTime) < currently) && (Date.parse(end.dateTime) > currently)) {
              const theRoom = whichRoom(event.location);
              if (roomStatus[theRoom]) {
                roomStatus[theRoom].taken = true;
                roomStatus[theRoom].details = {
                  name: event.summary,
                  attendees: event.attendees
                };
              }
            }
          }
          cb(roomStatus, allMeetings);
        });
      });
    });
}

export function signInWithGoogle(cb) {
  FBRef.authWithOAuthPopup('google', (error, authData) => {
    let valid;
    let res;
    if (authData !== undefined) {
      valid = checkDomain(authData.google.email);
    }
    if (valid) {
      getSchedule(authData.google.accessToken, calEvents => {
        res = {
          error: error,
          authData: authData,
          valid: valid,
          schedule: calEvents
        };
        cb(res);
      });
    } else {
      res = {
        error: error,
        authData: authData,
        valid: valid
      };
      cb(res);
    }
  }, {
    scope: 'email,https://www.googleapis.com/auth/calendar'
  });
}

export function persistUser(user) {
  FBRef.child('meetingplanner/users').child(user.uid).update({
    name: user.google.displayName,
    uid: user.uid,
    img: user.google.profileImageURL,
    expires: user.expires
  });
}

export function saveReservation(res, user) {
  FBRef.child('meetingplanner/users').child(user.uid).child('schedule').push(res);
}

export function getSession(cb) {
  cb(FBRef.getAuth());
}

export function logOut() {
  FBRef.unauth();
}


