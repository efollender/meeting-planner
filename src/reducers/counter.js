import { createReducer } from 'utils';

// normally this would be imported from /constants, but in trying to keep
// this starter kit as small as possible we'll just define it here.
import counterTypes from '../constants/counter';

const initialState = 0;
export default createReducer(initialState, {
  [counterTypes.COUNTER_INCREMENT] : (state) => state + 1,
  [counterTypes.COUNTER_DECREMENT] : (state) => state - 1
});
