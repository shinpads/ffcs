import React from 'react';

const Item = ({ perkId, width }) => {
  const url = `https://opgg-static.akamaized.net/images/lol/perk/${perkId}.png`
  return (
    <img alt="" target="_blank" width={width || 24} src={url} />
  );
}

export default Item;
