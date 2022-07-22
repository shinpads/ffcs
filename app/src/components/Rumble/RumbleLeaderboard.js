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
import { intToHexColorCode } from '../../helpers';

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
    flexBasis: '540px',
    boxShadow: `1px 1px 2px ${colors.black}`,
    height: '540px',
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
  },
  leaderboardColumnTitle: {
    fontSize: '20px',
    textTransform: 'uppercase',
  },
});

const RumbleLeaderboard = () => {
  const classes = styles();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const rumblePlayers = await getRumblePlayers();
      rumblePlayers.sort((a, b) => a.rumble_lp - b.rumble_lp);
      rumblePlayers.sort((a, b) => a.rumble_rank?.value - b.rumble_rank?.value);
      rumblePlayers.reverse();
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
                  Player
                </div>
              </TableCell>
              <TableCell align="left">
                <div className={classes.leaderboardColumnTitle}>
                  W/L
                </div>
              </TableCell>
              <TableCell align="left">
                <div className={classes.leaderboardColumnTitle}>
                  Rank
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
                  {player.rumble_wins} W {player.rumble_losses} L
                </TableCell>
                <TableCell component="th" scope="row">
                  <span style={{ color: intToHexColorCode(player.rumble_rank?.color) }}>{player.rumble_rank?.name}</span><span>, {player.rumble_lp} LP</span>
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
