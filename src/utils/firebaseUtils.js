import Firebase from 'firebase';
import creds from '../../lib/creds';
import axios from 'axios';
import moment from 'moment';

const FBRef = new Firebase(creds.firebase);
const today = new Date();
const theDay = today.getDate();
const theMonth = today.getMonth();
const theYear = today.getFullYear();
const rooms = ['biggie', 'smalls', 'lounge'];
let roomStatus = {
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

function persistCalendar(cal) {
  const id = cal.id.replace(/[^0-9|a-z|A-Z]/g, '');
  if (id.length > 1) {
    FBRef.child('meetingplanner/calendars').child(id).update({
      ...cal
    });
  }
}

function objectToArray(obj) {
  return Object.keys(obj).map(key => {
    return obj[key];
  });
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

export function getUserImage(usr, cb) {
  const userId = usr.email.replace(/[^0-9|a-z|A-Z]/g, '');
  let profileImg = 'http://www.brooklynunited.com/images/brooklyn-united-header-gear.gif';
  return FBRef.child('meetingplanner/users').child(userId).once('value', snapshot => {
    const profile = snapshot.val();
    if (profile) profileImg = profile.img;
    cb(profileImg);
  });
}

export function getSchedule(data, cb) {
  const token = encodeURIComponent(data);
  const theDate = (new Date()).toISOString();
  const timeMax = (new Date(theYear, theMonth, theDay + 7, 18, 0, 0)).toISOString();
  axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${token}&timeMin=${theDate}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`)
    .then((res) => {
      cb(res.data.items);
    })
    .catch((error) => {
      if (error.hasOwnProperty('data')) cb({error: error.data.error.code});
    });
}

export function getAllEvents(data, cb, timeMin, timeMax) {
  const {calendarID, token} = data;
  rooms.map(room => {
    axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?access_token=${token}&timeMin=${timeMin}&timeMax=${timeMax}&q=${room}&singleEvents=true`)
    .then(eventList => {
      if (eventList.data.items.length > 0) {
        eventList.data.items.map((event) => {
          cb(event);
        });
      } else {
        cb();
      }
    });
  });
}

export function getCalendars(data, cb) {
  FBRef.child('meetingplanner/calendars').once('value', snapshot => {
    if (snapshot.val()) {
      cb(snapshot.val());
    } else {
      axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${data}&fields=items%2Fid`)
        .then(res => {
          res.data.items.map(cal => {
            persistCalendar(cal);
          });
          cb(res.data.items);
        });
    }
  });
}

export function checkStatus(event, time) {
  const currently = time || new Date();
  const {start, end} = event;
  let theRoom;
  // If it has a start and end
  if (start.dateTime && end.dateTime) {
    // If it's currently happening
    if ((Date.parse(start.dateTime) <= Date.parse(currently)) && (Date.parse(end.dateTime) >= Date.parse(currently))) {
      theRoom = whichRoom(event.location);
      // If the room exists
      if (roomStatus[theRoom]) {
        roomStatus[theRoom].taken = true;
        roomStatus[theRoom].details = {
          name: event.summary,
          attendees: event.attendees,
          start: event.start.dateTime,
          end: event.end.dateTime
        };
      }
    }
  }
}

export function getAvailability(time, cb) {
  const token = encodeURIComponent(time.token);
  let calsChecked = 0;
  roomStatus = {
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
  const timeMin = moment(time.date).hour(9).minute(0);
  const timeMax = moment(time.date).hour(18).minute(0);
  getCalendars(token, res => {
    let calendars = res;
    if (typeof(res) === 'object') calendars = objectToArray(res);
    calendars.map(item => {
      const currentItem = item;
      const calendarID = encodeURIComponent(currentItem.id);
      const calData = {
        calendarID: calendarID,
        token: token
      };
      getAllEvents(calData, event => {
        calsChecked++;
        if (event) checkStatus(event, time.date);
        if (calsChecked >= (calendars.length * 3)) cb(roomStatus);
      }, timeMin.toISOString(), timeMax.toISOString());
    });
  });
}

export function checkRooms(data, cb) {
  const token = encodeURIComponent(data.token);
  let calsChecked = 0;
  const timeMin = data.timeMin || (new Date(theYear, theMonth, theDay, 9, 0, 0));
  const timeMax = data.timeMax || (new Date(theYear, theMonth, theDay, 18, 0, 0));
  const allMeetings = {
    date: data.timeMin,
    items: []
  };
  getCalendars(token, res => {
    let calendars = res;
    if (typeof(res) === 'object') calendars = objectToArray(res);
    calendars.map(item => {
      const currentItem = item;
      const calendarID = encodeURIComponent(currentItem.id);
      const calData = {
        calendarID: calendarID,
        token: token
      };
      getAllEvents(calData, event => {
        calsChecked++;
        if (event) {
          event.attendees.map(person => {
            if (person.displayName) {
              const roomResource = rooms.indexOf(person.displayName.toLowerCase());
              if ((roomResource > -1) && (event.location !== person.displayName)) {
                event.location += ' - ' + person.displayName;
              }
            }
          });
          allMeetings.items.push(event);
          if (moment(timeMin).isSame(moment(), 'day')) checkStatus(event);
        }
        if (calsChecked >= (calendars.length * 3)) cb(roomStatus, allMeetings);
      }, timeMin.toISOString(), timeMax.toISOString());
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

export function getUserList(cb) {
  return FBRef.child('meetingplanner/users').once('value', snapshot => {
    const users = objectToArray(snapshot.val());
    cb(users);
  });
}

export function persistUser(user) {
  const userId = user.google.email.replace(/[^0-9|a-z|A-Z]/g, '');
  FBRef.child('meetingplanner/users').child(userId).update({
    name: user.google.displayName,
    uid: user.google.id,
    img: user.google.profileImageURL,
    expires: user.expires,
    ...user.google,
    accessToken: null
  });
  FBRef.child('meetingplanner/calendars').child(userId).update({
    email: user.google.email
  });
}

export function saveReservation(res, user) {
  const userId = user.google.email.replace(/[^0-9|a-z|A-Z]/g, '');
  FBRef.child('meetingplanner/users').child(userId).child('schedule').push(res);
}

export function getSession(cb) {
  cb(FBRef.getAuth());
}

export function logOut() {
  FBRef.unauth();
}


