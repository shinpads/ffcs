import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
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

  useEffect(() => {
    async function getAllMatches() {
      const allMatches = await getMatches(1);
      setMatches(allMatches);
    }
    getAllMatches();
  }, []);

  return (
    <div className={classes.container}>
      {matches.map(match => <Match match={match} />)}
    </div>
  );
};

export default Matches;
