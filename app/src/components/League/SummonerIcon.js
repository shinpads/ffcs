import React from 'react';

const SummonerIcon = ({ iconId, width, rounded }) => {
  const url = `https://cdn.communitydragon.org/latest/profile-icon/${iconId}`
  return (
    <img alt="" target="_blank" width={width || 64} src={url} style={{ borderRadius: rounded ? '100%' : 0 }} />
  );
}

export default SummonerIcon;
