import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import colors from '../../colors';
import { getPlayers, getRumblePlayers } from '../../api';
import UserName from '../UserName';

const styles = createUseStyles({
  title: {
    textAlign: 'center',
    marginBottom: 0,
    fontSize: '28px',
    textTransform: 'uppercase',
  },
  leaderboardContainer: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
    height: '400px',
    overflowY: 'scroll',
  },
  descriptionContainer: {
    marginTop: '0.5rem',
    fontSize: '16px',
  },
  priorityPlayerName: {
    color: colors.gold,
  },
  footnote: {
    textAlign: 'center',
    color: colors.offwhite,
    fontSize: '14px',
  },
  leaderboardRow: {
    textAlign: 'left',
    fontSize: '16px',
    marginTop: '0.1rem',
    marginBottom: '0.1rem',
  },
  leaderboardRank: {
    color: colors.ranks.wench,
  },
  leaderboardColumnTitle: {
    fontSize: '24px',
  },
});

const RumbleLeaderboard = () => {
  const classes = styles();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const rumblePlayers = await getRumblePlayers();
      setPlayers(rumblePlayers);
    };
    getData();
  }, []);

  return (
    <div>
      <div className={classes.title}>
        Leaderboards
      </div>
      <TableContainer className={classes.leaderboardContainer} component={Paper}>
        <Table aria-label="rumble leaderboard table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <div className={classes.leaderboardColumnTitle}>
                  <strong>Player</strong>
                </div>
              </TableCell>
              <TableCell align="left">
                <div className={classes.leaderboardColumnTitle}>
                  <strong>Rank</strong>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, i) => (
              <TableRow key={player.id}>
                <TableCell component="th" scope="row">
                  <span>{i + 1}. </span>
                  <UserName user={player.user} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <div className={classes.leaderboardRank}>Wench</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RumbleLeaderboard;