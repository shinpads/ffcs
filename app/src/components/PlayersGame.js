import React from 'react';
import moment from 'moment';
import { Fade } from 'react-reveal';
import { createUseStyles } from 'react-jss';
import { Paper, Button } from '@material-ui/core';
import colors from '../colors';
import TeamName from './TeamName';
import { getImage } from '../helpers';
import ChampionIcon from './League/ChampionIcon';
import { IndividualParticipant } from './League/Participant';
import ParticipantName from './League/ParticipantName';

const styles = createUseStyles({
  container: {
    padding: '8px',
    marginBottom: '1rem',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
    display: 'grid',
    gridTemplateColumns: '0.8fr 4fr 2fr'
  },
  win: {
    borderLeft: `4px solid ${colors.primary}`
  },
  lose: {
    borderLeft: `4px solid ${colors.red}`
  },
  winColor: {
    color: colors.primary,
    fontWeight: 600,
  },
  loseColor: {
    color: colors.red,
    fontWeight: 600,
  },
  participantsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    overflow: 'hidden',
  },
  teamParticipantsContainer: {
    overflow: 'hidden',
  },
  matchTime: {
    color: colors.secondary,
  },
  gameDuration: {
    color: colors.secondary,
  },
  gameDetails: {
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }
});

const PlayersGame = ({ game, player }) => {
  const classes = styles();
  const { game_data: gameData } = game;
  const participantIdentity = gameData.participantIdentities.find(participantIdentity => participantIdentity.player.summonerId === player.account_id);
  if (!participantIdentity) return null;
  const participant = gameData.participants.find(participant => participant.participantId === participantIdentity.participantId);
  const won = game.winner === player.team.id;

  const [team1, team2] = game.match.teams;
  const team1TeamData = game.winner === team1.id ? gameData.teams.find(team => team.win === 'Win') : gameData.teams.find(team => team.win === 'Fail')
  const team2TeamData = game.winner === team2.id ? gameData.teams.find(team => team.win === 'Win') : gameData.teams.find(team => team.win === 'Fail')
  const team1Participants = gameData.participants.filter(participant => participant.teamId === team1TeamData.teamId);
  const team2Participants = gameData.participants.filter(participant => participant.teamId === team2TeamData.teamId);

  const gameDurationMinutes = (gameData.gameDuration / 60).toFixed(0);
  const gameDurationSeconds = gameData.gameDuration % 60;

  return (
    <a href={`/match/${game.match.id}`} className={`${classes.container} ${won ? classes.win : classes.lose}`}>
      <div className={classes.gameDetails}>
        <div className={classes.matchTime}>{moment(game.match.scheduled_for).fromNow()}</div>
        <div>
          <div className={won ? classes.winColor : classes.loseColor}>{won ? 'Victory' : 'Defeat'}</div>
          <div className={classes.gameDuration}>{gameDurationMinutes}m {gameDurationSeconds}s</div>
        </div>
      </div>
      <IndividualParticipant mvp={game.mvp === player.id} participant={participant} player={player} user={player.user} />
      <div className={classes.participantsContainer}>
        <TeamPartcipants participants={team1Participants} team={team1} game={game} />
        <TeamPartcipants participants={team2Participants} team={team2} game={game} />
      </div>
    </a>
  );
};

const TeamPartcipants = ({ participants, game, team }) => {
  const classes = styles();
  const { game_data: gameData } = game;
  return (
    <div className={classes.teamParticipantsContainer}>
      {participants.map(participant => {
        const participantIdentity = gameData.participantIdentities.find(identity => participant.participantId === identity.participantId) || {};
        const player = team.players.find(player => player.account_id === participantIdentity.player.summonerId) || {}
        return (
          <ParticipantName participant={participant} player={participantIdentity.player} user={player.user} />
        );
      })}
    </div>
  )
}

export default PlayersGame;
