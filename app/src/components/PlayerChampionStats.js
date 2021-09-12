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
import ChampionName from './League/ChampionName';

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
  noContainer: {
    padding: '0 !important',
    margin: '0 !important',
    borderRadius: '0 !important',
    boxShadow: '0px 0px !important',
  },
  cell: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: props => props.compact ? '1fr 2fr 1fr 1fr' : '1fr 2fr 3fr 2fr',
    borderBottom: props => props.compact ? '' : '1px solid',
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
    fontSize: props => props.compact ? '14px' : '16px',
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
    fontSize: props => props.compact ? '14px' : '16px',
  },
});

const kdaColor = (kda) => {
  if (kda >= 5) return colors.gold;
  if (kda >= 3) return colors.primary;
  return colors.white;
};

const winRateColor = (winRate) => {
  if (winRate >= 60) return colors.red;
  if (winRate >= 50) return colors.white;
  return colors.secondary;
}

const PlayerChampionStats = (props) => {
  const classes = styles(props);
  let { playerChampionStats, championMap, noContainer, limit, compact } = props;
  playerChampionStats.sort((a, b) => b.wins - a.wins);
  playerChampionStats.sort((a, b) => b.games_played - a.games_played);

  if (limit) {
    playerChampionStats = playerChampionStats.slice(0, limit);
  }

  return (
    <Paper className={noContainer ? classes.noContainer : classes.container}>
      {playerChampionStats.map(playerChampionStat => {
        const csPerMin = parseFloat(playerChampionStat.cs_per_min).toFixed(1);
        const kda = parseFloat(playerChampionStat.kda).toFixed(1);
        const winRate = ((playerChampionStat.wins / playerChampionStat.games_played) * 100).toFixed(0)
        return (
          <div className={classes.row} key={playerChampionStat.champion_id}>
            <div className={classes.cell}>
              <ChampionIcon championId={playerChampionStat.champion_id} rounded={compact} width={compact ? 24 : 32}/>
            </div>
            {!compact &&  (
              <div className={classes.cell} style={{ alignItems: 'start' }}>
                <div className={classes.championName}><ChampionName championId={playerChampionStat.champion_id} /></div>
                <div className={classes.csScore}>{csPerMin} CS/m</div>
              </div>
            )}
            <div className={classes.cell}>
              <div className={classes.kda} style={{ color: kdaColor(parseFloat(playerChampionStat.kda))}}>{kda} KDA</div>
              {!compact &&<div className={classes.killsDeathsAssists}>{parseFloat(playerChampionStat.kills).toFixed(1)} / {parseFloat(playerChampionStat.deaths).toFixed(1)} / {parseFloat(playerChampionStat.assists).toFixed(1)}</div>}
            </div>
            
            {compact && (
              <div className={classes.cell}>
                 <div className={classes.gamesPlayed}>{playerChampionStat.games_played}</div>
              </div>
            )}

            <div className={classes.cell}>
              <div className={classes.winRate} style={{ color: winRateColor(winRate)}}>{winRate}%</div>
              {!compact && <div className={classes.gamesPlayed}>{playerChampionStat.games_played} played</div>}
            </div>



          </div>
        )
      })}
    </Paper>
  );
};

function mapStateToProps(state) {
  return {
    championMap: state.league.championMap,
  };
}

export default connect(mapStateToProps)(PlayerChampionStats);
