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
});

const Matches = () => {
  const classes = styles();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllMatches() {
      const allMatches = await getMatches(2);
      console.log(allMatches);
      setMatches(allMatches);
      setLoading(false);
    }
    getAllMatches();
  }, []);

  return (
    <Tabs>
      <TabList>
        <Tab>Upcoming</Tab>
        <Tab>Results</Tab>
      </TabList>

      <TabPanel>
        {loading && 'LOADING...'}
        {!loading && (
          <div className={classes.container}>
            {matches.filter(m => !m.winner).map(match => <Match match={match} />)}
          </div>
        )}
      </TabPanel>
      <TabPanel>
      {loading && 'LOADING...'}
      {!loading && (
        <div className={classes.container}>
          {matches.filter(m => m.winner).map(match => <Match match={match} />)}
        </div>
      )}
      </TabPanel>
    </Tabs>
  );
};

export default Matches;
