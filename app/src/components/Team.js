import React from 'react';
import { createUseStyles } from 'react-jss';
import Player from './Player';
import colors from '../colors';

const sortIndex = {
  SUPP: 0,
  ADC: 1,
  MID: 2,
  JG: 3,
  TOP: 4,
};

const styles = createUseStyles({
  team: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '150px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
  players: {
  },
  teamName: {
    textAlign: 'center',
    fontWeight: 600,
    marginBottom: '8px',
    paddingBottom: '8px',
    textTransform: 'uppercase',
  },
});

const Team = ({ team }) => {
  const classes = styles();

  team.players.sort((a, b) => sortIndex[b.role] - sortIndex[a.role]);

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
