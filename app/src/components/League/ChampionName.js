import React from 'react';
import { connect } from 'react-redux';

const ChampionName = ({ championId, championMap }) => {
  if (!championMap) return null;
  const championName = Object.keys(championMap).find(name => championMap[name].key == championId)

  return championName;
};

function mapStateToProps(state) {
  return {
    championMap: state.league.championMap,
  };
}

export default connect(mapStateToProps)(ChampionName);
