import React, { useEffect } from 'react';
import { Fade } from 'react-reveal';
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

const Player = ({ player, viewed, delay }) => {
  const classes = styles();

  return (
    <Fade duration={viewed ? 0 : 1200} delay={viewed ? 0 : delay}>
      <div className={classes.player}>
        <Role role={player.role} />
        <div className={classes.playerName}>{player.user.summoner_name}</div>
      </div>
    </Fade>
  );
};

export default Player;
