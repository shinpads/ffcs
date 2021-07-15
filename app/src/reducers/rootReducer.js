import { combineReducers } from 'redux';
import userReducer from './userReducer';
import leagueReducer from './leagueReducer';
import matchReducer from './matchReducer';

export default combineReducers({
  user: userReducer,
  league: leagueReducer,
  matches: matchReducer,
});
