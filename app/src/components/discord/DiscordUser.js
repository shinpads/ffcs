import React from 'react';
import { createUseStyles } from 'react-jss';
import DiscordAvatar from './DiscordAvatar';

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
      <a href={`/user/${user.id}`} style={{ marginLeft: '0.5rem' }}>
        {user.discord_username}
      </a>
    </div>
  );
};

export default DiscordUser;
