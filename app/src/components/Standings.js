import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getStandings } from '../api';
import Match from './Match';

const styles = createUseStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '2rem',
  },
  standing: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    textAlign: 'center',
    fontSize: '20px',
  }
});

const Standings = () => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    async function start() {
      const newStandings = await getStandings(2);
      newStandings.sort((a, b) => b.w - a.w)
      setStandings(newStandings);
      setLoading(false);
    }
    start();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0 }}>STANDINGS</h1>
      {loading && 'LOADING...'}
      {!loading && (
        <div className={classes.container}>
          <div className={classes.standing} style={{ fontSize: '24px', fontWeight: 'bold' }}>
            <div>Team</div>
            <div>GP</div>
            <div>W</div>
            <div>L</div>
          </div>
          {standings.map(standing => (
            <div className={classes.standing}>
              <div>{standing.team.name}</div>
              <div>{standing.gp}</div>
              <div>{standing.w}</div>
              <div>{standing.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Standings;
