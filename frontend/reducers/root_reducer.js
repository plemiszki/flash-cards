import { combineReducers } from 'redux';
import StandardReducer from './reducer_standard';

const rootReducer = combineReducers({
  standardReducer: StandardReducer
});

export default rootReducer;
