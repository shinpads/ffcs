import React from 'react';

const SummonerIcon = ({ iconId }) => {
  const url = `https://cdn.communitydragon.org/latest/profile-icon/${iconId}`
  return (
    <img alt="" target="_blank" width={64} src={url} />
  );
}

export default SummonerIcon;
