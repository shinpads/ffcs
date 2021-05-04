import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getMatches } from '../api';
import Match from './Match';

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

const Matches = () => {
  const classes = styles();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesByWeek, setMatchesByWeek] = useState({});

  useEffect(() => {
    async function getAllMatches() {
      const allMatches = await getMatches(2);
      const newMatchesByWeek = {}
      allMatches.forEach(match => {
        if (!newMatchesByWeek[match.week]) {
          newMatchesByWeek[match.week] = [];
        }
        newMatchesByWeek[match.week].push(match);
      });
      console.log(newMatchesByWeek);
      setMatchesByWeek(newMatchesByWeek);
      setMatches(allMatches);
      setLoading(false);
    }
    getAllMatches();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0 }}>MATCHES</h1>
      {loading && 'LOADING...'}
      {!loading && (
        <div className={classes.container}>
          {Object.keys(matchesByWeek).sort().map(weekNum => (
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

export default Matches;
