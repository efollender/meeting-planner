import {createReducer} from 'utils';
import * as uiConstants from 'constants/uiConstants';

const initialState = {
  schedule: [],
  roomStatus: {
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
  },
  allMeetings: [],
  dateLookup: {},
  availability: {
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
  }
};

function sortRooms(meetings) {
  const roomMeetings = {
    biggie: [],
    smalls: [],
    lounge: []
  };
  meetings.map(el =>{
    Object.keys(roomMeetings).map(room => {
      const roomReg = new RegExp(room, 'g');
      if (roomReg.test(el.location.toLowerCase())) {
        roomMeetings[room].push(el);
      }
    });
  });
  return roomMeetings;
}

export default createReducer(initialState, {
  [uiConstants.AVAILABILITY_REQUEST] : (store) => {
    return {
      ...store,
      loading: true
    };
  },
  [uiConstants.AVAILABILITY_RECEIVED] : (store, data) => {
    return {
      ...store,
      availability: data,
      loading: false
    };
  },
  [uiConstants.SCHEDULE_REQUEST] : (store) => {
    return {
      ...store,
      loading: true
    };
  },
  [uiConstants.SCHEDULE_RECEIVED] : (store, data) => {
    return {
      ...store,
      schedule: data,
      loading: false,
      lastScheduleRequest: Date.parse(new Date())
    };
  },
  [uiConstants.ROOM_STATUS_REQUEST] : (store) => {
    return {
      ...store,
      loading: true
    };
  },
  [uiConstants.ROOM_STATUS_RECEIVED] : (store, data) => {
    return {
      ...store,
      roomStatus: data[0],
      allMeetings: sortRooms(data[1].items),
      dateLookup: {
        date: data[1].date,
        items: sortRooms(data[1].items)
      },
      loading: false,
      lastRoomRequest: Date.parse(new Date())
    };
  },
  [uiConstants.ROOM_STATUS_ERROR] : (store, data) => {
    return {
      ...store,
      error: data,
      loggedIn: false
    };
  },
  [uiConstants.DATE_LOOKUP_REQUEST] : (store) => {
    return {
      ...store,
      loading: true
    };
  },
  [uiConstants.DATE_LOOKUP_RECEIVED] : (store, data) => {
    return {
      ...store,
      dateLookup: {
        date: data.date,
        items: sortRooms(data.items)
      },
      loading: false
    };
  },
  [uiConstants.USER_LIST_REQUEST] : (store) => {
    return store;
  },
  [uiConstants.USER_LIST_RECEIVED] : (store, data) => {
    return {
      ...store,
      userList: data
    };
  }
});
