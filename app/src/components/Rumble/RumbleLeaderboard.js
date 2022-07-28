/* eslint-disable no-nested-ternary */
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
import { getAllRanks, getPlayers, getRumblePlayers } from '../../api';
import UserName from '../UserName';
import { intToHexColorCode } from '../../helpers';
import { Tooltip, withStyles } from '@material-ui/core';

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
    textAlign: 'center',
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
  leaderboardColumnTitle: {
    fontSize: '20px',
    textTransform: 'uppercase',
  },
  rankInfoContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '1rem',
  },
  rankInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankInfoName: {
    float: 'left',
  },
  rankInfoMinLP: {
    float: 'right',
  },
  lightLine: {
    backgroundColor: colors.offwhite,
    height: '1px',
    border: 'none',
  },
  rankInfoText: {
    color: colors.primary,
    fontSize: '16px',
  }
});

const RumbleLeaderboard = () => {
  const classes = styles();

  const [players, setPlayers] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const rumblePlayers = await getRumblePlayers();
      let allRanks = await getAllRanks();
      allRanks = allRanks.ranks;
      allRanks.sort((a, b) => a.threshold_percentile - b.threshold_percentile);
      console.log(allRanks);
      rumblePlayers.sort((a, b) => a.rumble_lp - b.rumble_lp);
      rumblePlayers.sort((a, b) => a.rumble_rank?.value - b.rumble_rank?.value);
      rumblePlayers.reverse();
      setPlayers(rumblePlayers);
      setRanks(allRanks);
    };
    getData();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div />
    );
  }

  return (
    <div>
      <div className={classes.title}>
        Leaderboards
      </div>
      <HtmlTooltip
        title={(
          <div>
            <div className={classes.descriptionContainer}>
              Your LP changes as you win and lose games, down to -100 LP and up to infinity. After playing 4 games,
              you will be ranked. Ranks are percentile based -- meaning you may demote/promote even if you missed
              the game! Below are the rank percentiles and minimum LP required to reach the rank:
            </div>
            <div className={classes.rankInfoContainer}>
              {ranks?.map((rank, i) => (
                <div>
                  {i ? <hr className={classes.lightLine} /> : ''}
                  <div className={classes.rankInfoRow}>
                    <span style={{ color: intToHexColorCode(rank.color) }} className={classes.rankInfoName}>
                      {rank.name} ({parseFloat(rank.threshold_percentile)?.toString()}th percentile)
                    </span>
                    <span className={classes.rankInfoMinLP}>
                      {rank.is_top_rank ? '#1 Player'
                        : rank.is_default ? 'Default'
                          : (rank.threshold_percentile - 0) < 0.001 ? 'No minimum LP'
                            : `${rank.min_lp  } LP`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      >
        <div className={classes.rankInfoText}>
          What do the ranks mean?
        </div>
      </HtmlTooltip>
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

const HtmlTooltip = withStyles({
  tooltip: {
    fontSize: '12px',
    backgroundColor: colors.darkGrey,
    border: '1px solid white',
  },
})(Tooltip);

export default RumbleLeaderboard;
