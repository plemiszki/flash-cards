import { combineReducers } from 'redux';
import NounsReducer from './reducer_nouns';

const rootReducer = combineReducers({
  nouns: NounsReducer
});

export default rootReducer;
