import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getPlayers } from '../api';
import Match from './Match';
import TeamName from './TeamName';
import Spinner from './Spinner';

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

const styles = createUseStyles({
  container: {
    boxShadow: '1px 1px 2px #000 !important',
  },
  typeContainer: {
    display: 'flex',
    alignItems: 'center',
  }
});

const Leaderboard = () => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [kdaKing, setKdaKing] = useState(null);
  const [kpKing, setKpKing] = useState(null);
  const [damageKing, setDamageKing] = useState(null);
  const [killsKing, setKillsKing] = useState(null);
  const [assistsKing, setAssistsKing] = useState(null);
  const [visionKing, setVisionKing] = useState(null);
  const [csKing, setCsKing] = useState(null);
  const [ccKing, setCcKing] = useState(null);

  useEffect(() => {
    async function start() {
      let allPlayers = await getPlayers();
      allPlayers = allPlayers.filter(player => player.stats)
      console.log(allPlayers)

      // KDAstyle="fill:white;"
      allPlayers.sort((a, b) => b.stats.kda_per_game - a.stats.kda_per_game)
      setKdaKing(allPlayers[0])

      // KP
      allPlayers.sort((a, b) => b.stats.kp_per_game - a.stats.kp_per_game)
      setKpKing(allPlayers[0])

      // DAMAGE
      allPlayers.sort((a, b) => b.stats.damage_per_min - a.stats.damage_per_min)
      setDamageKing(allPlayers[0])

      // KILLS
      allPlayers.sort((a, b) => b.stats.kills - a.stats.kills)
      setKillsKing(allPlayers[0])

      // ASSISTS
      allPlayers.sort((a, b) => b.stats.assists - a.stats.assists)
      setAssistsKing(allPlayers[0])

      // VISION
      allPlayers.sort((a, b) => b.stats.vision_per_min - a.stats.vision_per_min)
      setVisionKing(allPlayers[0])

      // CS
      allPlayers.sort((a, b) => b.stats.cs_per_min - a.stats.cs_per_min)
      setCsKing(allPlayers[0])

      // CC
      allPlayers.sort((a, b) => b.stats.cc_per_game - a.stats.cc_per_game)
      setCcKing(allPlayers[0])



      setLoading(false);
    }
    start();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0 }}>LEADERBOARDS</h1>
      <br />
      {loading && <Spinner />}
      {!loading && (
        <TableContainer classes={{ root: classes.container }} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Achievement</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(kdaIcon)} />
                    KDA
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{kdaKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{kdaKing.stats.kda_per_game}</TableCell>
              </TableRow>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(kpIcon)} />
                    KP
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{kpKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{kpKing.stats.kp_per_game}%</TableCell>
              </TableRow>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(damageIcon)} />
                    Damage / Min
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{damageKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{damageKing.stats.damage_per_min}</TableCell>
              </TableRow>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(killIcon)} />
                    Kills
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{killsKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{killsKing.stats.kills}</TableCell>
              </TableRow>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(assistsIcon)} />
                    Assists
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{assistsKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{assistsKing.stats.assists}</TableCell>
              </TableRow>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(visionIcon)} />
                    Vision / Min
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{visionKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{visionKing.stats.vision_per_min}</TableCell>
              </TableRow>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(csIcon)} />
                    CS / Min
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{csKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{csKing.stats.cs_per_min}</TableCell>
              </TableRow>
              <TableRow key="">
                <TableCell component="th" scope="row">
                  <div className={classes.typeContainer}>
                    <img style={{ marginRight: '8px' }}  alt="" target="_blank" width={24} src={getImage(ccIcon)} />
                    CC Score
                  </div>
                </TableCell>
                <TableCell component="th" scope="row">{ccKing.user.summoner_name}</TableCell>
                <TableCell component="th" scope="row">{ccKing.stats.cc_per_game}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <br />
    </div>
  );
};

export default Leaderboard;
