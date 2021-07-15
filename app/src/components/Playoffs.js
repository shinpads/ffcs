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

const Playoffs = (props) => {
  const classes = styles();

  const { playOffMatchesByFraction } = props.matches;


  if (!playOffMatchesByFraction || !Object.keys(playOffMatchesByFraction).length) {
    return null;
  }


  // temp
  return null;

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0 }}>PLAYOFFS</h1>
      <div className={classes.container}>
        playoffs here
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    matches: state.matches,
  };
}


export default connect(mapStateToProps)(Playoffs);
