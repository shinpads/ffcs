import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import Teams from './Teams';
import Matches from '../Matches';
import Header from '../Header';
import Role from '../Role';
import colors from '../../colors';
import { getUser } from '../../api';
import Spinner from '../Spinner';
import TeamName from '../TeamName';
import ChampionIcon from '../League/ChampionIcon';
import PlayerChampionStats from '../PlayerChampionStats';
import SummonerIcon from '../League/SummonerIcon';
import PlayersGame from '../PlayersGame';


const styles = createUseStyles({
  topContainer: {
    fontSize: '24px',
    textTransform: 'uppercase',
    display: 'flex',
    marginBottom: '1rem',
    padding: '8px',
    boxShadow: '1px 1px 2px #000 !important',
  },
  description: {
    textAlign: 'center',
    color: colors.offwhite,
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingTop: '5rem',
  },
  teamContainer: {
    display: 'flex',
    fontSize: '18px',
    marginTop: '4px',
  },
  profileIconContainer: {
    marginRight: '1rem',
    display: 'flex',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '4fr 8fr',
    gridGap: '1rem',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '4px',
  },
});

const UserProfile = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);

  const { league } = props;

  useEffect(() => {
    async function getData() {
      const { dispatch } = props;
      const { id } = props.match.params;
      const data = await getUser(id);
      console.log(data);
      setUser(data.user);
      setGames(data.games);
      setLoading(false);
    }
    getData();
  }, []);

  if (loading || !league.loaded) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <Spinner />
        </div>
      </>
    );
  }

  const player = user.players[user.players.length - 1];
  return (
    <>
      <Header />
      <div className={classes.container}>
        <Paper className={classes.topContainer}>
          <div className={classes.profileIconContainer}>
            <SummonerIcon rounded iconId={player.profile_icon_id} />
          </div>
          <div className={classes.userDetailsContainer}>
            <div>{user.summoner_name}</div>
            <div className={classes.teamContainer}>
              <Role role={player.role} />
              <div>{player.team.name}</div>
            </div>
          </div>
        </Paper>
        <div className={classes.content}>
          <div>
            <div className={classes.sectionTitle}>Champion Stats</div>
            <PlayerChampionStats playerChampionStats={player.player_champion_stats} />
          </div>
          <div>
            <div className={classes.sectionTitle}>Games</div>
            {games.map(game => {
              return (
                <PlayersGame game={game} player={player} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    league: state.league,
  };
}

export default connect(mapStateToProps)(UserProfile);