import React from 'react';

const PerkIcon = ({ perkStyleId, width }) => {
  const url = `https://opgg-static.akamaized.net/images/lol/perkStyle/${perkStyleId}.png`
  
  return (
    <img alt="" target="_blank" width={width || 24} src={url} />
  );
}

export default PerkIcon;
