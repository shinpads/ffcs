import React from 'react';



const ChampionIcon = ({ championId, width, rounded }) => {
  const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`

  const style = {
    borderRadius: 0,
  };

  if (rounded) {
    style.borderRadius = '100%';
  }

  return (
    <img alt="" target="_blank" width={width || 32} src={url} style={style} />
  );
}

export default ChampionIcon;
