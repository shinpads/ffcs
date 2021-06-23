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
import Participant from '../League/Participant';
import TeamName from '../TeamName';
import ChampionIcon from '../League/ChampionIcon';
import PlayerChampionStats from '../PlayerChampionStats';
import { getChampions } from '../../actions/leagueActions';
import SummonerIcon from '../League/SummonerIcon';


const styles = createUseStyles({
  topContainer: {
    fontSize: '24px',
    textTransform: 'uppercase',
    display: 'flex',
    marginBottom: '1rem',
  },
  description: {
    textAlign: 'center',
    color: colors.offwhite,
  },
  container: {
    maxWidth: '900px',
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
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '4fr 7fr'
  }
});

const UserProfile = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { league } = props;

  useEffect(() => {
    async function getData() {
      const { dispatch } = props;
      dispatch(getChampions());
      const { id } = props.match.params;
      const user = await getUser(id);
      setUser(user);
      console.log(user);

      setLoading(false);
    }
    getData();
  }, []);

  if (loading || !league.champions.loaded) {
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
        <div className={classes.topContainer}>
          <div className={classes.profileIconContainer}>
            <SummonerIcon iconId={player.profile_icon_id} />
          </div>
          <div className={classes.userDetailsContainer}>
            <div>{user.summoner_name}</div>
            <div className={classes.teamContainer}>
              <Role role={player.role} />
              <div>{player.team.name}</div>
            </div>
          </div>
        </div>
        <div className={classes.content}>
          <div>
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>Champion Stats</div>
            <PlayerChampionStats playerChampionStats={player.player_champion_stats} />
          </div>
          <div style={{ fontSize: '24px', textAlign: 'center', marginTop: '18px' }}>
            More details coming soon!
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
