import axios from 'axios';

import { SET_LEAGUE_DATA } from './actionTypes';

export const getLeagueData = () => async (dispatch, getState) => {
  try {
    const { league } = getState();
    if (league.loaded) {
      return;
    }
    const versions = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versions.data[0];

    const requests = [
      axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`),
      axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/summoner.json`),
    ];

    const [
      championsResult,
      summonerResult,
    ] = await Promise.all(requests);

    await dispatch({
      type: SET_LEAGUE_DATA,
      payload: {
        championMap: championsResult.data.data,
        summonerMap: summonerResult.data.data,
        latestVersion,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export default {
  getLeagueData,
};
