import React from 'react';
import { connect } from 'react-redux';

const Item = ({ itemId, width, league }) => {
  width = width || 24;
  if (!itemId) {
    return (
      <div style={{
        height: width, width, borderRadius: '4px', backgroundColor: 'black', opacity: '0.5',
      }}
      />
    );
  }
  const url = `http://ddragon.leagueoflegends.com/cdn/${league.latestVersion}/img/item/${itemId}.png`;
  return (
    <img alt={itemId} target="_blank" width={width} src={url} style={{ borderRadius: '4px' }} />
  );
};

function mapStateToProps(state) {
  return {
    league: state.league,
  };
}

export default connect(mapStateToProps)(Item);
