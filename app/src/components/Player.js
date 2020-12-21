import React from 'react';
import { createUseStyles } from 'react-jss';
import Role from './Role';

const styles = createUseStyles({
  player: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerName: {
    fontWeight: 500,
    fontSize: '20px'
  },
});

const Player = ({ player }) => {
  const classes = styles();

  return (
    <div className={classes.player}>
      <div className={classes.playerName}>{player.username}</div>
      <Role role={player.role} />
    </div>
  );
};

export default Player;
