import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Teams from './Teams';
import Matches from '../Matches';
import Header from '../Header';
import Role from '../Role';
import colors from '../../colors';
import { getMatch } from '../../api';
import Spinner from '../Spinner';
import Participant from '../League/Participant';
import TeamName from '../TeamName';
import ChampionIcon from '../League/ChampionIcon';

const styles = createUseStyles({
  title: {
    fontSize: '24px',
    textAlign: 'center',
    textTransform: 'uppercase',
    display: 'flex',
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
  winningTeam: {
    textDecoration: 'underline',
  },
  losingTeam: {
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

  console.log(matchData);

  const team1 = matchData.match.teams[0];
  const team2 = matchData.match.teams[1];
  const numTeam1Wins = matchData.match.games.filter(game => game.winner === team1.id).length
  const numTeam2Wins = matchData.match.games.filter(game => game.winner === team2.id).length
  const winner = matchData.match.winner.id;

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.title}>
          <TeamName key={team1.id} team={team1} nameClass={winner === team1.id ? classes.winningTeam : (winner !== null ? classes.losingTeam : '')} />
          <div style={{ padding: '0px 8px' }}>{` (${numTeam1Wins}) `}</div>
          {' vs '}
          <div style={{ padding: '0px 8px' }}>{` (${numTeam2Wins}) `}</div>
          <TeamName key={team2.id} team={team2} nameClass={winner === team2.id ? classes.winningTeam : (winner !== null ? classes.losingTeam : '')} />
        </div>

        <br />

        {matchData.match.games.map(game => {
          const gameData      = matchData.game_datas.find(gameData => gameData.gameId == game.game_id);
          const gameWinner    = matchData.match.teams.find(team => team.id === game.winner);
          const team1TeamData = game.winner === team1.id ? gameData.teams.find(team => team.win === 'Win') : gameData.teams.find(team => team.win === 'Fail')
          const team2TeamData = game.winner === team2.id ? gameData.teams.find(team => team.win === 'Win') : gameData.teams.find(team => team.win === 'Fail')
          const team1Participants = gameData.participants.filter(participant => participant.teamId === team1TeamData.teamId);
          const team2Participants = gameData.participants.filter(participant => participant.teamId === team2TeamData.teamId);
          const team1Kills    = team1Participants.reduce((acc, cur) => acc + cur.stats.kills, 0);
          const team1Deaths   = team1Participants.reduce((acc, cur) => acc + cur.stats.deaths, 0);
          const team1Assists  = team1Participants.reduce((acc, cur) => acc + cur.stats.assists, 0);
          const team2Kills    = team2Participants.reduce((acc, cur) => acc + cur.stats.kills, 0);
          const team2Deaths   = team2Participants.reduce((acc, cur) => acc + cur.stats.deaths, 0);
          const team2Assists  = team2Participants.reduce((acc, cur) => acc + cur.stats.assists, 0);
          return (
            <div>
              <div>Game {game.game_in_series} of {matchData.match.games.length} - <b>Winner: {gameWinner.name}</b> in {Math.floor(gameData.gameDuration / 60)}m</div>
              <br />

              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Ban 1</TableCell>
                      <TableCell align="right">Ban 2</TableCell>
                      <TableCell align="right">Ban 3</TableCell>
                      <TableCell align="right">Ban 4</TableCell>
                      <TableCell align="right">Ban 5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={team1.name}>
                      <TableCell component="th" scope="row"><TeamName team={team1} /></TableCell>
                      {team1TeamData.bans.map(ban => <TableCell align="right"><ChampionIcon championId={ban.championId} /></TableCell>)}
                    </TableRow>
                    <TableRow key={team2.name}>
                      <TableCell component="th" scope="row"><TeamName team={team2} /></TableCell>
                      {team2TeamData.bans.map(ban => <TableCell align="right"><ChampionIcon championId={ban.championId} /></TableCell>)}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <br />

              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"><TeamName team={team1}/></TableCell>
                      <TableCell align="center">{team1Kills} / {team1Deaths} / {team1Assists}</TableCell>
                      <TableCell align="center">vs</TableCell>
                      <TableCell align="center">{team2Kills} / {team2Deaths} / {team2Assists}</TableCell>
                      <TableCell align="right"><TeamName team={team2}/></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[0, 1, 2, 3, 4].map(index => {
                      const team1Participant = team1Participants[index];
                      const team1ParticipantIdentity = gameData.participantIdentities.find(identity => team1Participant.participantId === identity.participantId) || {};
                      const team1Player = team1.players.find(player => player.account_id === team1ParticipantIdentity.player.summonerId);
                      const team2Participant = team2Participants[index];
                      const team2ParticipantIdentity = gameData.participantIdentities.find(identity => team2Participant.participantId === identity.participantId) || {};
                      const team2Player = team2.players.find(player => player.account_id === team2ParticipantIdentity.player.summonerId);
                      return (
                        <TableRow>
                          <TableCell style={{ width: '30%' }} align="left" component="th" scope="row">
                            <Participant mvp={game.mvp === team1Player.id} participant={team1Participant} player={team1ParticipantIdentity.player} />
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">{team1Participant.stats.kills} / {team1Participant.stats.deaths} / {team1Participant.stats.assists}</TableCell>
                          <TableCell align="center" component="th" scope="row"><Role role={ROLES[index].role} /></TableCell>
                          <TableCell align="center" component="th" scope="row">{team2Participant.stats.kills} / {team2Participant.stats.deaths} / {team2Participant.stats.assists}</TableCell>
                          <TableCell style={{ width: '30%' }} align="right" component="th" scope="row">
                            <Participant mvp={game.mvp === team2Player.id} reverse participant={team2Participant} player={team2ParticipantIdentity.player} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Match;
