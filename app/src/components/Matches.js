import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getMatches } from '../api';
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

const Matches = () => {
  const classes = styles();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesByWeek, setMatchesByWeek] = useState({});
  const [currentWeek, setCurrentWeek] = useState(-1);

  useEffect(() => {
    async function getAllMatches() {
      const allMatches = await getMatches(2);
      console.log(allMatches);
      const newMatchesByWeek = {}
      allMatches.forEach(match => {
        if (!newMatchesByWeek[match.week]) {
          newMatchesByWeek[match.week] = [];
        }
        newMatchesByWeek[match.week].push(match);
      });
      let newCurrentWeek = -1;
      Object.keys(newMatchesByWeek).sort((a, b) => parseInt(a) - parseInt(b)).forEach(week => {
        if (newMatchesByWeek[week].filter(match => !match.winner).length > 0) {
          if (newCurrentWeek === -1) {
            newCurrentWeek = week;
          }
        }
      })
      setCurrentWeek(newCurrentWeek);
      setMatchesByWeek(newMatchesByWeek);
      setMatches(allMatches);
      setLoading(false);
    }
    getAllMatches();
  }, []);


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

export default Matches;
