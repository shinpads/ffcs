import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import Team from '../Team';
import { getSeason } from '../../api';

const styles = createUseStyles({
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
});

const Teams = () => {
  const classes = styles();
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    async function getTeams() {
      console.log('calling');
      const season = await getSeason(1);
      console.log(season.teams);
      if (season && season.teams) {
        setTeams(season.teams);
      }
    }
    getTeams();
  }, []);
  return (
    <div className={classes.container}>
      {teams.map(team => <Team team={team} />)}
    </div>
  );
};

export default Teams;
