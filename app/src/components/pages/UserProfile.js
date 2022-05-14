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
import { getAllSeasons, getUser } from '../../api';
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
    paddingTop: '6rem',
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
  seasonButtonsContainer: {
    marginBottom: '4px',
    display: 'flex',
    flexDirection: 'row',
  },
  seasonButton: {
    padding: '4px',
  },
});

const UserProfile = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState();
  const [allSeasons, setAllSeasons] = useState();
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);

  const { league } = props;

  const changeSeasons = (id) => {
    setSelectedSeason(id);
    setGames(allGames.filter(game => game.match.season === id));
  };

  useEffect(() => {
    async function getData() {
      const { id } = props.match.params;
      const data = await getUser(id);
      const seasons = await getAllSeasons();
      const allUserSeasons = data.user.players.map(player => player.team.season);
      const userMostRecentSeason = Math.max(...allUserSeasons);
      setUser(data.user);
      setAllGames(data.games);
      setSelectedSeason(userMostRecentSeason);
      setGames(data.games.filter(game => game.match.season === userMostRecentSeason));
      setAllSeasons(seasons.filter(season => allUserSeasons.includes(season.id)));
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

  let player = user.players.filter(curPlayer => curPlayer.team.season === selectedSeason)[0];
  if (!player) {
    player = user.players[user.players.length - 1];
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.seasonButtonsContainer}>
          {allSeasons.map(season => (
            <div className={classes.seasonButton}>
              <Button variant={season.id === selectedSeason ? 'contained' : 'outlined'} onClick={() => changeSeasons(season.id)}> Season {season.number} </Button>
            </div>
          ))}
        </div>
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
            {games.map(game => (
              <PlayersGame game={game} player={player} />
            ))}
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
