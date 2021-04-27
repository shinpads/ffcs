import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import Team from '../Team';
import { getSeason, submitVote, getVote } from '../../api';

const styles = createUseStyles({
  teamsSetContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '2rem',
    width: '100%',
  },
  teamsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  teamOption: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '24px',
  },
});

const Teams = () => {
  const classes = styles();
  const [teamsDisplay1, setTeamsDisplay1] = useState(null);
  const [teamsDisplay2, setTeamsDisplay2] = useState(null);
  const [voted, setVoted] = useState(false);
  let teamCards1 = <div />;
  let teamCards2 = <div />;

  function revealTeams1() {
    setTeamsDisplay1(teamCards1);
  }

  function revealTeams2() {
    setTeamsDisplay2(teamCards2);
  }

  const voteForOption = (number) => async () => {
    await submitVote(number);
    window.location.reload();
  }

  const MOCK_SEASON_1_ID = 21;
  const MOCK_SEASON_2_ID = 22;

  useEffect(() => {
    async function getTeams() {
      const existingVote = await getVote();
      await setVoted(existingVote);

      const mockSeason1 = await getSeason(MOCK_SEASON_1_ID);
      const mockSeason2 = await getSeason(MOCK_SEASON_2_ID);

      if (mockSeason1 && mockSeason1.teams) {
        teamCards1 = (
          <div>
            <div className={classes.teamOption}>Option 1</div>
            <div className={classes.teamsContainer}>
              {mockSeason1.teams.map((team, index) => (
                <Team
                  team={team}
                  delay={index * 5000}
                  viewed={existingVote}
                />
              ))}
            </div>
            {!existingVote &&
              <Button
                style={{ margin: 10 }}
                variant="contained"
                onClick={voteForOption(MOCK_SEASON_1_ID)}
                fullWidth
              >
                Vote Option 1
              </Button>
            }
          </div>
        );
      }

      if (mockSeason2 && mockSeason2.teams) {
        teamCards2 = (
          <div>
            <div className={classes.teamOption}>Option 2</div>
            <div className={classes.teamsContainer}>
              {mockSeason2.teams.map((team, index) => (
                <Team
                  team={team}
                  delay={index * 5000}
                  viewed={existingVote}
                />
              ))}
            </div>
            {!existingVote &&
              <Button
                style={{ margin: 10 }}
                variant="contained"
                onClick={voteForOption(MOCK_SEASON_2_ID)}
                fullWidth
              >
                Vote Option 2
              </Button>
            }
          </div>
        );
      }

      setTeamsDisplay1(
        <div style={{ margin: '0 auto' }} >
          <Button
            style={{ margin: 10 }}
            variant="contained"
            onClick={revealTeams1}
          >
            Reveal Option 1
          </Button>
        </div>
      );
      setTeamsDisplay2(
        <div style={{ margin: '0 auto' }} >
          <Button
            style={{ margin: 10 }}
            variant="contained"
            onClick={revealTeams2}
          >
            Reveal Option 2
          </Button>
        </div>
      );
    }
    getTeams();
  }, []);

  return (
    <div className={classes.teamsSetContainer}>
      {teamsDisplay1}
      {teamsDisplay2}
    </div>
  );
};

export default Teams;
