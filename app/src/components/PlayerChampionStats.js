import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { getPlayers } from '../api';
import Match from './Match';
import TeamName from './TeamName';
import Spinner from './Spinner';
import colors from '../colors';
import ChampionIcon from './League/ChampionIcon';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// pictures
import { getImage } from '../helpers';
import kpIcon from '../../public/leaderboard/kp.svg';
import kdaIcon from '../../public/leaderboard/kda.svg';
import visionIcon from '../../public/leaderboard/vision.svg';
import assistsIcon from '../../public/leaderboard/assists.svg';
import damageIcon from '../../public/leaderboard/damage.svg';
import killIcon from '../../public/leaderboard/kill.svg';
import csIcon from '../../public/leaderboard/cs.svg';
import ccIcon from '../../public/leaderboard/cc.svg';
import damageTakenIcon from '../../public/leaderboard/damage_taken.svg';

const styles = createUseStyles({
  container: {
    boxShadow: '1px 1px 2px #000 !important',
    // maxWidth: '300px',
  },
  cell: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 3fr 2fr',
    borderBottom: '1px solid',
    borderColor: colors.offwhite,
  },
  championName: {
    fontWeight: 'bold',
  },
  csScore: {
    color: colors.secondary,
    fontSize: '14px',
  },
  kda: {
    fontWeight: 'bold',
  },
  killsDeathsAssists: {
    color: colors. secondary,
    fontSize: '14px',
  },
  gamesPlayed: {
    color: colors. secondary,
    fontSize: '14px',
  },
  winRate: {
    fontWeight: 'bold',
  },
});

const kdaColor = (kda) => {
  if (kda > 5) return colors.gold;
  if (kda > 3) return colors.primary;
  return colors.white;
};

const winRateColor = (winRate) => {
  if (winRate > 60) return colors.red;
  if (winRate > 50) return colors.white;
  return colors.secondary;
}

const PlayerChampionStats = ({ playerChampionStats, championMap }) => {
  const classes = styles();
  playerChampionStats.sort((a, b) => b.games_played - a.games_played)
  console.log(playerChampionStats);
  console.log(championMap);

  return (
    <Paper className={classes.container}>
      {playerChampionStats.map(playerChampionStat => {
        const championName = Object.keys(championMap).find(name => championMap[name].key == playerChampionStat.champion_id)
        const winRate = ((playerChampionStat.wins / playerChampionStat.games_played) * 100).toFixed(1)
        return (
          <div className={classes.row} key={playerChampionStat.champion_id}>
            <div className={classes.cell}>
              <ChampionIcon championId={playerChampionStat.champion_id} />
            </div>
            <div className={classes.cell} style={{ alignItems: 'start' }}>
              <div className={classes.championName}>{championName}</div>
              <div className={classes.csScore}>{playerChampionStat.cs_per_min} CS/m</div>
            </div>
            <div className={classes.cell}>
              <div className={classes.kda} style={{ color: kdaColor(parseFloat(playerChampionStat.kda))}}>{playerChampionStat.kda} KDA</div>
              <div className={classes.killsDeathsAssists}>{parseFloat(playerChampionStat.kills).toFixed(1)} / {parseFloat(playerChampionStat.deaths).toFixed(1)} / {parseFloat(playerChampionStat.assists).toFixed(1)}</div>
            </div>
            <div className={classes.cell}>
              <div className={classes.winRate} style={{ color: winRateColor(winRate)}}>{winRate}%</div>
              <div className={classes.gamesPlayed}>{playerChampionStat.games_played} played</div>
            </div>
          </div>
        )
      })}
    </Paper>
  );
};

function mapStateToProps(state) {
  return {
    championMap: state.league.champions.championMap,
  };
}

export default connect(mapStateToProps)(PlayerChampionStats);
