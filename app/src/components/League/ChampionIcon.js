import React from 'react';

const ChampionIcon = ({ championId }) => {
  const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`
  return (
    <img  alt="" target="_blank" width={32} src={url} />
  );
}

export default ChampionIcon;
