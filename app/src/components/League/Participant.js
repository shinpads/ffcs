import React from 'react';
import { createUseStyles } from 'react-jss';
import ChampionIcon from './ChampionIcon';

const styles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  summonerName: {
    margin: '0px 8px',
  }
});

const Participant = ({ participant, player, reverse }) => {
  const classes = styles();

  return (
    <div className={classes.root} style={reverse ? { flexDirection: 'row-reverse' } : {}}>
      <ChampionIcon championId={participant.championId} />
      <div className={classes.summonerName}>{player.summonerName}</div>
    </div>
  );
}

export default Participant;
