import React, { useEffect } from 'react';
import { Fade } from 'react-reveal';
import { Paper } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import colors from '../colors';
import Role from './Role';
import SummonerIcon from './League/SummonerIcon';
import PlayerChampionStats from './PlayerChampionStats';

const styles = createUseStyles({
  player: {
    alignItems: 'center',
    borderLeft: `1px solid ${colors.darkestGrey}`,
    borderRight: `1px solid ${colors.darkestGrey}`,
  },
  playerName: {
    fontWeight: 500,
    color: colors.white,
    marginLeft: '4px',
    lineHeight: '12px',
  },
  roleContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0.5rem 0',
  },
  summonerDetails: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
});

const PlayerDetailed = ({ player }) => {
  const classes = styles();

  return (
    <div className={classes.player}>
      <div className={classes.roleContainer}>
        <Role role={player.role} width={32} />
      </div>
      <a href={`/user/${player.user.id}`} className={classes.summonerDetails}>
        <SummonerIcon rounded iconId={player.profile_icon_id} width={32} />
        <div className={classes.playerName}>{player.user.summoner_name}</div>
      </a>
      <PlayerChampionStats noContainer compact limit={5} playerChampionStats={player.player_champion_stats} />
    </div>
  );
};

export default PlayerDetailed;
