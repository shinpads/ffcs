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
import OldPlayersGame from '../OldPlayersGame';
import { intToHexColorCode } from '../../helpers';

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
  manageProfileContainer: {
    marginRight: '1rem',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
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
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  listContainer: {
    paddingTop: '7px',
    paddingBottom: '7px',
    paddingLeft: '8px',
    fontSize: '20px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  smurfLink: {
    color: '#3366BB',
  },
  seasonButtonsContainer: {
    marginBottom: '4px',
    display: 'flex',
    flexDirection: 'row',
  },
  seasonButton: {
    padding: '4px',
  },
  managerUserButton: {
    color: '#3366BB',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  teamName: ({ teamColor }) => ({
    color: teamColor,
  }),
});

const UserProfile = (props) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState();
  const [allSeasons, setAllSeasons] = useState();
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);

  const selectedSeasonIsRumble = allSeasons?.find(curSeason => curSeason.id === selectedSeason).is_rumble;
  let player = user?.players?.find(curPlayer => curPlayer.team?.season === selectedSeason || (curPlayer.is_rumble && selectedSeasonIsRumble));
  if (!player) {
    player = user?.players[user.players.length - 1];
  }

  const classes = styles({ teamColor: intToHexColorCode(player?.team?.color) });

  const { league } = props;

  const { loaded: userLoaded, user: loggedInUser } = props.user;

  const changeSeasons = (id) => {
    setSelectedSeason(id);
    setGames(allGames.filter(game => game.match.season === id));
  };

  useEffect(() => {
    async function getData() {
      const { id } = props.match.params;
      const data = await getUser(id);
      const seasons = await getAllSeasons();
      const allUserSeasons = data.user.players
        .filter(curPlayer => curPlayer.team !== null)
        .map(curPlayer => curPlayer.team.season);
      const rumblePlayer = (data.user.players.find(curPlayer => curPlayer.is_rumble));
      if (rumblePlayer) {
        allUserSeasons.push(seasons.find(curSeason => curSeason.is_rumble).id);
      }
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

  if (loading || !league.loaded || !userLoaded) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <Spinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.seasonButtonsContainer}>
          {allSeasons.map(season => (
            <div className={classes.seasonButton}>
              <Button variant={season.id === selectedSeason ? 'contained' : 'outlined'} onClick={() => changeSeasons(season.id)}> {season.name} </Button>
            </div>
          ))}
        </div>
        <Paper className={classes.topContainer}>
          <div className={classes.profileIconContainer}>
            <SummonerIcon rounded iconId={player.profile_icon_id} />
          </div>
          <div className={classes.userDetailsContainer}>
            <div>{user.summoner_name}</div>
            {!selectedSeasonIsRumble && (
            <div className={classes.teamContainer}>
              <Role role={player.role} />
              <div>
                <a href={`https://ffcsleague.com/team/${player.team.id}`} className={classes.teamName}>
                  {player.team.name}
                </a>
              </div>
            </div>
            )}
          </div>
          {loggedInUser.id === user.id && (
          <div className={classes.manageProfileContainer}>
            <a href={`/user/${user.id}/manage`} className={classes.managerUserButton}>Manage Profile</a>
          </div>
          )}
        </Paper>
        <div className={classes.content}>
          <div className={classes.leftContainer}>
            <div className={classes.sectionTitle}>Champion Stats</div>
            <PlayerChampionStats playerChampionStats={player.player_champion_stats} />
            {user.smurfs && (
            <div><div className={classes.sectionTitle}>Smurfs</div>
              <Paper>
                {user.smurfs.map(smurf => (
                  <div className={classes.listContainer}>
                    <a href={`https://na.op.gg/summoners/na/${smurf}`} className={classes.smurfLink}>{smurf}</a>
                  </div>
                ))}
              </Paper>
            </div>
            )}
          </div>
          <div>
            <div className={classes.sectionTitle}>Games</div>
            {games.map(game => (game.is_old_data_format ? <OldPlayersGame game={game} player={player} /> : <PlayersGame game={game} player={player} />))}
          </div>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
    league: state.league,
  };
}

export default connect(mapStateToProps)(UserProfile);
