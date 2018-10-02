import { combineReducers } from 'redux';
import StandardReducer from './reducer_standard';
import NounsReducer from './reducer_nouns';

const rootReducer = combineReducers({
  standardReducer: StandardReducer,
  nounsReducer: NounsReducer
});

export default rootReducer;
