import React from 'react';
import moment from 'moment';
import { Fade } from 'react-reveal';
import { createUseStyles } from 'react-jss';
import { Paper } from '@material-ui/core';
import colors from '../colors';

const styles = createUseStyles({
  container: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '250px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    color: colors.offwhite,
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '18px',
  }
});

const Match = ({ match }) => {
  const classes = styles();
  let date = `WEEK ${match.week}`;
  if (match.scheduled_for) {
    date = moment(match.scheduled_for).format('MMM Do h:mm a')
  }


  if (match.teams.length != 2) return <div />

  let team1 = match.teams[0];
  let team2 = match.teams[1];

  return (
    <div className={classes.container}>
      <div className={classes.topContainer}>
        <div>{date}</div>
        <div>BEST OF {match.match_format}</div>
      </div>
      <div className={classes.bottomContainer}>
        <div>{team1.name}</div>
        <div>VS.</div>
        <div>{team2.name}</div>
      </div>
    </div>
  );
};

export default Match;
