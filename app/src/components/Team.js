import React from 'react';
import { Fade } from 'react-reveal';
import { createUseStyles } from 'react-jss';
import Player from './Player';
import colors from '../colors';
import sortTeamPlayers from '../util/sortTeamPlayers';

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

const Team = ({ team, viewed, delay }) => {
  const classes = styles();

  team.players = sortTeamPlayers(team.players);

  return (
    <Fade duration={viewed ? 0 : 1500} delay={viewed ? 0 : delay}>
      <div className={classes.team}>
        <div className={classes.teamName}>{team.name}</div>
        <div className={classes.players}>
          {team.players.map((player, index) => <Player viewed={viewed} player={player} delay={delay + (index + 1) * (5000 / 6)} />)}
        </div>
      </div>
    </Fade>
  );
};

export default Team;
