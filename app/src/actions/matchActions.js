import axios from 'axios';
import { SET_MATCHES } from './actionTypes';

export const getMatches = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/matches/');

    const matchesByWeek = {};
    const playOffMatchesByFraction = {};
    const currentSeasonMatchesByWeek = {};
    const matchesByTeam = {};

    if (res.data) {
      const { matches } = res.data.data;
      const currentSeasonId = res.data.data.current_season_id;

      let maxPlayoffFraction = 1;

      matches.forEach(match => {
        if (match.playoff_fraction) {
          if (!playOffMatchesByFraction[match.playoff_fraction]) {
            playOffMatchesByFraction[match.playoff_fraction] = [];
          }

          maxPlayoffFraction = Math.max(maxPlayoffFraction, match.playoff_fraction);

          playOffMatchesByFraction[match.playoff_fraction].push(match);
        }
        if (!matchesByWeek[match.week]) {
          matchesByWeek[match.week] = [];
        }
        if (!currentSeasonMatchesByWeek[match.week]) {
          currentSeasonMatchesByWeek[match.week] = [];
        }
        matchesByWeek[match.week].push(match);
        if (match.season === currentSeasonId) {
          currentSeasonMatchesByWeek[match.week].push(match);
        }
        match.teams.forEach(team => {
          if (!matchesByTeam[team.id]) {
            matchesByTeam[team.id] = {};
          }
          if (!matchesByTeam[team.id][match.week]) {
            matchesByTeam[team.id][match.week] = [];
          }
          matchesByTeam[team.id][match.week].push(match);
        });
      });

      // ensure there are keys for all playoff fractions all the way to the finals
      while (maxPlayoffFraction > 1) {
        maxPlayoffFraction /= 2;
        if (!playOffMatchesByFraction[maxPlayoffFraction]) {
          playOffMatchesByFraction[maxPlayoffFraction] = [];
        }
      }

      await dispatch({
        type: SET_MATCHES,
        payload: {
          matchesByWeek,
          playOffMatchesByFraction,
          currentSeasonMatchesByWeek,
          matchesByTeam,
        },
      });
    } else {
      throw new Error('Failed to get matches');
    }
  } catch (err) {
    console.error(err);
  }
};

export default {
  getMatches,
};
