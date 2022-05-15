import React from 'react';
import { connect } from 'react-redux';

const SummonerIcon = ({
  iconId, width, rounded, league,
}) => {
  const url = `https://ddragon.leagueoflegends.com/cdn/${league.latestVersion}/img/profileicon/${iconId}.png`;
  return (
    <img alt="" target="_blank" width={width || 64} src={url} style={{ borderRadius: rounded ? '100%' : 0 }} />
  );
};

function mapStateToProps(state) {
  return {
    league: state.league,
  };
}

export default connect(mapStateToProps)(SummonerIcon);
