import React from 'react'
import DiscordAvatar from './DiscordAvatar'
import { createUseStyles } from 'react-jss';

const styles = createUseStyles({
  user: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
  },
});

const DiscordUser = ({ user }) => {
  const classes = styles();
  return (
    <div className={classes.user}>
      <DiscordAvatar userId={user.discord_user_id} avatar={user.avatar} />
      <div style={{ marginLeft: '0.5rem' }}>{user.discord_username}</div>
    </div>
  );
};

export default DiscordUser;
