import React from 'react'

const DiscordAvatar = ({
  avatar,
  userId,
}) => (
  <img style={{ borderRadius: '32px' }} width={32} height={32} src={`https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`} alt="" />
);

export default DiscordAvatar;
