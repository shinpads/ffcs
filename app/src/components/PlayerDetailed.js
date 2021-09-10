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
    cursor: 'pointer',
    marginBottom: '1rem',
    padding: '8px',
    boxShadow: '1px 1px 2px #000 !important',
    width: '300px',
    alignItems: 'center',
  },
  playerName: {
    fontWeight: 500,
    color: colors.white,
    marginLeft: '4px',
    lineHeight: '12px',
  },
});

const PlayerDetailed = ({ player }) => {
  const classes = styles();

  return (
    <a href={`/user/${player.user.id}`}>
      <Paper className={classes.player}>
        <div style={{ display: 'flex' }}>
          <SummonerIcon rounded iconId={player.profile_icon_id} width={32} />
          <div className={classes.playerName}>{player.user.summoner_name}</div>
        </div>
        <PlayerChampionStats noContainer limit={5} playerChampionStats={player.player_champion_stats} />
      </Paper>
    </a>
  );
};

export default PlayerDetailed;
