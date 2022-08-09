import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import UserName from './UserName';
import colors from '../colors';
import Spinner from './Spinner';
import TeamName from './TeamName';
import Match from './Match';
import { getPlayersCurrentSeason } from '../api';

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
  leaderboardContainer: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '540px',
    boxShadow: `1px 1px 2px ${colors.black}`,
    height: '450px',
    overflowY: 'scroll',
  },
  typeContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  medal: {
    width: '16px',
    height: '16px',
    borderRadius: '16px',
    marginRight: '4px',
  },
  playerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});

const leaderboards = [
  {
    name: 'KDA',
    icon: kdaIcon,
    key: 'kda_per_game',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'KP',
    icon: kpIcon,
    key: 'kp_per_game',
    sortType: -1,
    prefix: '',
    suffix: '%',
  },
  {
    name: 'Damage / Min',
    icon: damageIcon,
    key: 'damage_per_min',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'Kills / Game',
    icon: killIcon,
    key: 'kills',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'Assists / Game',
    icon: assistsIcon,
    key: 'assists',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'Deaths / Game',
    icon: killIcon,
    key: 'deaths',
    sortType: 1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'Vision / Min',
    icon: visionIcon,
    key: 'vision_per_min',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'CS / Min',
    icon: csIcon,
    key: 'cs_per_min',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'CC Score',
    icon: ccIcon,
    key: 'cc_per_game',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
  {
    name: 'Damage Taken / Game',
    icon: damageTakenIcon,
    key: 'damage_taken',
    sortType: -1,
    prefix: '',
    suffix: '',
  },
];

const rankColors = [
  colors.gold,
  colors.silver,
  colors.bronze,
];

const Leaderboard = () => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState(null);

  useEffect(() => {
    async function start() {
      let getPlayersRes = await getPlayersCurrentSeason(true);
      getPlayersRes = getPlayersRes.filter(player => player.stats);

      setAllPlayers(getPlayersRes);

      setLoading(false);
    }
    start();
  }, []);

  return (
    <div>
      {loading && <Spinner />}
      {!loading && (
        <TableContainer className={classes.leaderboardContainer} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Achievement</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboards.map(lb => {
                const sortedPlayers = allPlayers.sort((a, b) => (parseFloat(a?.stats.[lb.key]) - parseFloat(b?.stats.[lb.key])) * lb.sortType);
                return (
                  <TableRow key={lb.key}>
                    <TableCell component="th" scope="row">
                      <div className={classes.typeContainer}>
                        <img style={{ marginRight: '8px' }} alt="" target="_blank" width={24} src={getImage(lb.icon)} />
                        {lb.name}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {[0, 1, 2].map(index => (
                        <div className={classes.playerContainer}>
                          <div className={classes.medal} style={{ backgroundColor: rankColors[index] }} />
                          <div style={index === 0 ? { fontWeight: 'bold' } : {}}>
                            <UserName user={sortedPlayers[index]?.user} nameClass={classes.summonerName} />
                          </div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {[0, 1, 2].map(index => (
                        <div>
                          {lb.prefix + sortedPlayers[index]?.stats[lb.key] + lb.suffix}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <br />
    </div>
  );
};

export default Leaderboard;
