import React from 'react';
import moment from 'moment';
import { Fade } from 'react-reveal';
import { createUseStyles } from 'react-jss';
import { Paper, Button } from '@material-ui/core';
import colors from '../colors';
import TeamName from './TeamName';
import { copyTextToClipboard } from '../helpers';

const styles = createUseStyles({
  container: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    color: colors.offwhite,
  },
  middleContainer: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 3fr',
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '1rem',
  },
  bottomContainer: {

  },
});

const Match = ({ match }) => {
  const classes = styles();
  let date = `WEEK ${match.week}`;
  if (match.scheduled_for) {
    date = moment(match.scheduled_for).format('MMM Do h:mm a')
  }

  console.log(match);

  if (match.teams.length != 2) return <div />

  let team1 = match.teams[0];
  let team2 = match.teams[1];

  return (
    <div className={classes.container}>
      <div className={classes.topContainer}>
        <div>{date}</div>
        <div>BEST OF {match.match_format}</div>
      </div>
      <div className={classes.middleContainer}>
        <TeamName team={team1} />
        <div>VS.</div>
        <TeamName team={team2} />
      </div>
      <div className={classes.bottomContainer}>
        {match.games.filter(game => game.tournament_code).map(game => (
          <Button style={{ fontSize: '12px', float: 'right' }} onClick={() => copyTextToClipboard(game.tournament_code)}>Copy Tournament Code</Button>
        ))}
      </div>
    </div>
  );
};

export default Match;
