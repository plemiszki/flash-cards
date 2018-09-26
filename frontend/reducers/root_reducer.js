import { combineReducers } from 'redux';
import NounsReducer from './reducer_nouns';

const rootReducer = combineReducers({
  nounsReducer: NounsReducer
});

export default rootReducer;
