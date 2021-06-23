import React from 'react';
import moment from 'moment';
import { Fade } from 'react-reveal';
import { createUseStyles } from 'react-jss';
import { Paper, Button } from '@material-ui/core';
import colors from '../colors';
import TeamName from './TeamName';
import { getImage } from '../helpers';
import ChampionIcon from './League/ChampionIcon';
import Participant from './League/Participant';

const styles = createUseStyles({
  container: {
    padding: '8px',
    marginBottom: '1rem',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
});

const PlayersGame = ({ game, player }) => {
  const classes = styles();
  console.log(game);
  const { game_data: gameData } = game;
  const participantIdentity = gameData.participantIdentities.find(participantIdentity => participantIdentity.player.summonerId === player.account_id);
  if (!participantIdentity) return null;
  const participant = gameData.participants.find(participant => participant.participantId === participantIdentity.participantId);
  console.log(participant);
  return (
    <div className={classes.container}>
      <Participant mvp={game.mvp === player.id} participant={participant} player={player} user={player.user} />
    </div>
  );
};

export default PlayersGame;
