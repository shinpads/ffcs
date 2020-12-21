import React from 'react';
import { createUseStyles } from 'react-jss';
import Player from './Player';
import colors from '../colors';

const styles = createUseStyles({
  team: {
    padding: '1rem',
    margin: '1rem 0 1rem 0',
    border: '1px solid',
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderRadius: '4px',
  },
  players: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  },
  teamName: {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '24px',
    marginBottom: '2rem',
  },
});

const Team = ({ team }) => {
  const classes = styles();
  return (
    <div className={classes.team}>
      <div className={classes.teamName}>{team.name}</div>
      <div className={classes.players}>
        {team.players.map(player => <Player player={player} />)}
      </div>
    </div>
  );
};

export default Team;
