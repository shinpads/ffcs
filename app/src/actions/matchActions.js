import axios from 'axios';
import { SET_MATCHES } from './actionTypes';

export const getMatches = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/matches/');

    const matchesByWeek = {}
    const playOffMatchesByFraction = {};

    if (res.data) {
      const matches = res.data.data;

      matches.forEach(match => {
        if (match.playoff_fraction) {
          if (!playOffMatchesByFraction[match.playoff_fraction]) {
            playOffMatchesByFraction[match.playoff_fraction] = [];
          }

          playOffMatchesByFraction[match.playoff_fraction].push(match);

        } else {
          if (!matchesByWeek[match.week]) {
            matchesByWeek[match.week] = [];
          }
          matchesByWeek[match.week].push(match);
        }
      });

      await dispatch({
        type: SET_MATCHES,
        payload: {
          matchesByWeek,
          playOffMatchesByFraction,
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
