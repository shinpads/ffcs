import React from 'react';
import { createUseStyles } from 'react-jss';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ChampionIcon from './ChampionIcon';
import Item from './Item';
import colors from '../../colors';
import UserName from '../UserName';

const styles = createUseStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  summonerName: {
    margin: '0px 4px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

const ParticipantName = ({ participant, player, mvp, isSub, user }) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      <ChampionIcon width={16} championId={participant.championId} />
      {user
        ? (<UserName user={user} nameClass={classes.summonerName} />)
        : (<div className={classes.summonerName}>{player.summonerName}</div>)
      }
    </div>
  );
}

export default ParticipantName;
