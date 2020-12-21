import color from '@material-ui/core/colors/amber';
import React from 'react';
import { createUseStyles } from 'react-jss';
import colors from '../colors';
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
    fontSize: '20px',
    color: colors.white,
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
