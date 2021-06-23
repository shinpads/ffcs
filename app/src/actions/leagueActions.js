import axios from 'axios';

import { SET_CHAMPIONS } from './actionTypes';

export const getChampions = () => async (dispatch, getState) => {
  try {
    const { league } = getState();
    if (league.champions.loaded) {
      return;
    }
    const versions = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versions.data[0];

    const res = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
    await dispatch({
      type: SET_CHAMPIONS,
      payload: {
        championMap: res.data.data,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export default {
  getChampions,
};
