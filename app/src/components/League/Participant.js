import React from 'react';
import { createUseStyles } from 'react-jss';
import ChampionIcon from './ChampionIcon';

const styles = createUseStyles({
  root: {
    display: 'flex',
  },
});

const Participant = ({ participant, player }) => {
  const classes = styles();

  return (
    <div className={classes.root}>
      <ChampionIcon championId={participant.championId} />
      <div>{player.summonerName}</div>
    </div>
  );
}

export default Participant;
