import React from 'react';
import { createUseStyles } from 'react-jss';
import colors from '../colors';
import Role from './Role';

const styles = createUseStyles({
  player: {
    display: 'flex',
    padding: '4px',
    cursor: 'pointer',
    '&:hover': {
      borderLeft: '4px solid white',
    },
  },
  playerName: {
    fontWeight: 500,
    color: colors.white,
    marginLeft: '4px',
  },
});

const Player = ({ player }) => {
  const classes = styles();

  return (
    <div className={classes.player}>
      <Role role={player.role} />
      <div className={classes.playerName}>{player.username}</div>
    </div>
  );
};

export default Player;
