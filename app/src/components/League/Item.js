import React from 'react';

const Item = ({ itemId, width }) => {
  if (!itemId) {
    return (
      <div style={{ height: width, width: width, borderRadius: '4px', backgroundColor: 'black', opacity: '0.5' }} />
    )
  }
  const url = `http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${itemId}.png`
  return (
    <img alt="" target="_blank" width={width || 24} src={url} style={{ borderRadius: '4px' }} />
  );
}

export default Item;
