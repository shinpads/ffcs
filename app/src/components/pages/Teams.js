import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import Team from '../Team';
import { getSeason } from '../../api';

const styles = createUseStyles({
  teamsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

const Teams = () => {
  const classes = styles();
  const [teamsDisplay, setTeamsDisplay] = useState(<div />);
  let teamCards = <div />;

  function revealTeams() {
    localStorage.setItem('viewed', '1');
    setTeamsDisplay(teamCards);
  }

  useEffect(() => {
    async function getTeams() {
      const season = await getSeason(1);
      if (season && season.teams) {
        teamCards = season.teams.map((team, index) => (
          <Team
            team={team}
            delay={index * 8000}
            viewed={localStorage.getItem('viewed')}
          />
        ));
      }
      if (!localStorage.getItem('viewed')) {
        setTeamsDisplay(
          <Button
            style={{ margin: 10 }}
            variant="contained"
            onClick={revealTeams}
          >
            Reveal Teams
          </Button>,
        );
      } else {
        setTeamsDisplay(teamCards);
      }
    }
    getTeams();
  }, []);
  return (
    <div className={classes.teamsContainer}>
      {teamsDisplay}
    </div>
  );
};

export default Teams;
