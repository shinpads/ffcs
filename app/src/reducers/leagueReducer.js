import { SET_LEAGUE_DATA } from '../actions/actionTypes';

const initalState = {
  loaded: false,
  championMap: null,
  summonerMap: null,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case SET_LEAGUE_DATA:
      return {
        ...state,
        loaded: true,
        championMap: action.payload.championMap,
        summonerMap: action.payload.summonerMap,
      };
    default:
      return state;
  }
};
