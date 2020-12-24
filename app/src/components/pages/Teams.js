import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import Button from '@material-ui/core/Button';
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
    localStorage.setItem('teamsViewed', '1');
    setTeamsDisplay(teamCards);
  }

  useEffect(() => {
    async function getTeams() {
      console.log('calling');
      const season = await getSeason(1);
      console.log(season.teams);

      if (season && season.teams) {
        teamCards = season.teams.map(team => <Team team={team} />);
      }

      if (!localStorage.getItem('teamsViewed')) {
        setTeamsDisplay(
          <Button
            style={{ margin: 10 }}
            variant="contained"
            onClick={revealTeams}
          >
            Reveal Teams
          </Button>,
        );
        window.viewed = 1;
      } else {
        setTeamsDisplay(teamCards);
        window.viewed = 0;
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
