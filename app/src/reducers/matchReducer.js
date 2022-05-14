import { SET_MATCHES } from '../actions/actionTypes';

const initalState = {
  loaded: false,
  matchesByWeek: null,
  playOffMatchesByFraction: null,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case SET_MATCHES:
      return {
        ...state,
        loaded: true,
        matchesByWeek: action.payload.matchesByWeek,
        playOffMatchesByFraction: action.payload.playOffMatchesByFraction,
        currentSeasonMatchesByWeek: action.payload.currentSeasonMatchesByWeek,
        matchesByTeam: action.payload.matchesByTeam,
      };
    default:
      return state;
  }
};
