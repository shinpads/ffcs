import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Teams from './Teams';
import Matches from '../Matches';
import Header from '../Header';
import Role from '../Role';
import colors from '../../colors';
import { getMatch } from '../../api';
import Spinner from '../Spinner';
import Participant from '../League/Participant';


const styles = createUseStyles({
  title: {
    fontSize: '48px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  description: {
    textAlign: 'center',
    color: colors.offwhite,
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    paddingTop: '5rem',
  },
  teams: {
    display: 'flex',
  },
});

const ROLES = [
  { role: 'top', id: 1 },
  { role: 'jungle', id: 2 },
  { role: 'mid', id: 3 },
  { role: 'bot', id: 4 },
  { role: 'support', id: 5 }
]

const Match = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    async function getData() {
      const { id } = props.match.params;
      const matchData = await getMatch(id);
      setMatchData(matchData);
      setLoading(false);
    }
    getData();
  }, []);
  if (loading) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <Spinner />
        </div>
      </>
    );
  }

  const team1 = matchData.match.teams[0];
  const team2 = matchData.match.teams[1];

  return (
    <>
      <Header />
      <div className={classes.container}>
        <h3>{team1.name} vs {team2.name}</h3>
        <p>This page is a work in progress.</p>
        {matchData.match.games.map(game => {
          const gameData = matchData.game_datas.find(gameData => gameData.gameId == game.game_id);
          console.log(gameData);
          return (
            <div>
              <div>Game {game.game_in_series} of {matchData.match.games.length}</div>
              <br />
              <div className={classes.teams}>
                <div>
                  {gameData.participants.filter(p => p.teamId === 100).map(participant => {
                    const participantIdentity = gameData.participantIdentities.find(identity => participant.participantId === identity.participantId) || {};
                    return (
                      <Participant participant={participant} player={participantIdentity.player} />
                    )
                  })}
                </div>
                <div>
                  {gameData.participants.filter(p => p.teamId === 200).map(participant => {
                    const participantIdentity = gameData.participantIdentities.find(identity => participant.participantId === identity.participantId) || {};
                    return (
                      <Participant participant={participant} player={participantIdentity.player} />
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Match;
