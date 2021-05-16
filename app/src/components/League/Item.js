import React from 'react';

const Item = ({ itemId }) => {
  const url = `http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${itemId}.png`
  return (
    <img alt="" target="_blank" width={24} src={url} />
  );
}

export default Item;
