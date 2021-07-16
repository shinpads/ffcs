import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getMatches } from '../actions/matchActions';
import Match from './Match';
import Spinner from './Spinner';

const styles = createUseStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  weekNum: {
    width: '100%',
    textTransform: 'uppercase',
    textAlign: 'center',
  }
});

const Matches = (props) => {
  const classes = styles();

  const { matchesByWeek, playOffMatchesByFraction } = props.matches;


  const loading = !matchesByWeek;

  let currentWeek = -1;
  if (!loading) {
    Object.keys(matchesByWeek).sort((a, b) => parseInt(a) - parseInt(b)).forEach(week => {
      if (matchesByWeek[week].filter(match => !match.winner).length > 0) {
        if (currentWeek === -1) {
          currentWeek = week;
        }
      }
    });
  }
  if (currentWeek === -1) {
    currentWeek = 10; 
  }


  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0 }}>THIS WEEK'S MATCHES</h1>
      {loading && <Spinner />}
      {!loading && (
        <div className={classes.container}>
          <>
            {matchesByWeek[currentWeek].map(match => <Match match={match} />)}
          </>
          {Object.keys(matchesByWeek).filter(week => week != currentWeek).sort((a, b) => parseInt(a) - parseInt(b)).map(weekNum => (
            <>
              <h2 className={classes.weekNum}>Week {weekNum}</h2>
              {matchesByWeek[weekNum].map(match => <Match match={match} />)}
            </>
          ))}
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    matches: state.matches,
  };
}


export default connect(mapStateToProps)(Matches);
