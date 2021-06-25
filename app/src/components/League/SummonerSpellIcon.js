import React from 'react';
import { connect } from 'react-redux';

const SummonerSpellIcon = ({ spellId, width, summonerMap }) => {
  if (!summonerMap) return null;
  const spellName = Object.keys(summonerMap).find(name => summonerMap[name].key == spellId);
  const url = `http://ddragon.leagueoflegends.com/cdn/11.13.1/img/spell/${spellName}.png`
  return (
    <img alt="" target="_blank" width={width || 16} src={url} />
  );
};

function mapStateToProps(state) {
  return {
    summonerMap: state.league.summonerMap,
  };
}

export default connect(mapStateToProps)(SummonerSpellIcon);
