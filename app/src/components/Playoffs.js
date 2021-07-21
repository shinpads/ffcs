import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getMatches } from '../actions/matchActions';
import colors from '../colors';
import Match from './Match';
import Spinner from './Spinner';
import TeamName from './TeamName';


const styles = createUseStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  weekNum: {
    width: '100%',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  playoffMatch: {
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    boxShadow: `1px 1px 2px ${colors.black}`,
    margin: '1rem 0rem',
    minWidth: '150px',
  },
  playoffStage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '0rem 2rem',
  },
  playoffMatchSection: {
    padding: '0.5rem',
  }
});

const Playoffs = (props) => {
  const classes = styles();

  const { playOffMatchesByFraction } = props.matches;


  if (!playOffMatchesByFraction || !Object.keys(playOffMatchesByFraction).length) {
    return null;
  }

  const playOffFractions = Object.keys(playOffMatchesByFraction).sort().reverse();


  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0 }}>PLAYOFFS</h1>
      <div className={classes.container}>
        {playOffFractions.map(fraction => {
          const matches = playOffMatchesByFraction[fraction];
          console.log(matches, fraction)
          return (
            <div className={classes.playoffStage}>
              {matches.map(match => {
                return (
                  <PlayoffMatch match={match} />
                );
              })}
              {[...Array(fraction - matches.length).keys()].map(index => {
                return (
                  <PlayoffMatch match={null} />
                )
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    matches: state.matches,
  };
}


const PlayoffMatch = ({ match }) => {
  const classes = styles();

  if (match) {
    return (
      <div className={classes.playoffMatch}>
        <div className={classes.playoffMatchSection}>
          <TeamName team={match.teams[0]} />
        </div>
        <hr style={{ margin: 0, borderColor: colors.offwhite }} />
        <div className={classes.playoffMatchSection}>
          <TeamName team={match.teams[1]} />
        </div>
      </div>
    )
  }
  else {
    return (
      <div className={classes.playoffMatch}>
        <div className={classes.playoffMatchSection}>
          <div>TBD</div>
        </div>
        <hr style={{ margin: 0, borderColor: colors.offwhite }} />
        <div className={classes.playoffMatchSection}>
          <div>TBD</div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Playoffs);
