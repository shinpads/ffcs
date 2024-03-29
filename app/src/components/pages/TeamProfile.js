import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';

import Header from '../Header';
import PlayerDetailed from '../PlayerDetailed';
import colors from '../../colors';
import { getPlayer, getTeam } from '../../api';
import Spinner from '../Spinner';
import SummonerIcon from '../League/SummonerIcon';
import sortTeamPlayers from '../../util/sortTeamPlayers';
import Matches from '../Matches';
import { getMatches } from '../../actions/matchActions';
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
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
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
  players: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    boxShadow: '1px 1px 2px #000 !important',
  },
  manageTeam: {
    color: '#3366BB',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  teamName: ({ teamColor }) => ({
    color: teamColor,
  }),
  matches: {
    marginTop: '12px',
  },
  teamLogo: {
    borderRadius: '100%',
  },
});

const TeamProfile = (props) => {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const classes = styles({ teamColor: intToHexColorCode(team?.color) });

  const {
    league, matches, match, dispatch,
  } = props;
  const teamId = match.params.id;

  useEffect(() => {
    async function getData() {
      const data = await getTeam(teamId);
      data.players = sortTeamPlayers(data.players);
      dispatch(getMatches(data.season));
      setTeam(data);
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

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.contentContainer}>
          <div>
            <Paper className={classes.topContainer}>
              <div className={classes.profileIconContainer}>
                {team.logo_url
                  ? <img alt="" target="_blank" width={96} src={team.logo_url} className={classes.teamLogo} />
                  : <SummonerIcon rounded iconId={2} />}
              </div>
              <div className={classes.userDetailsContainer}>
                <div className={classes.teamName}>{team.name}</div>
                {team.is_captain && <a href={`/team/${team.id}/manage`} className={classes.manageTeam}>Manage Team</a>}
              </div>
            </Paper>
            <Paper className={classes.players}>
              {team.players.map(player => <PlayerDetailed player={player} isCaptain={player.user.id === team.captain.user.id} />)}
            </Paper>
          </div>
          <div className={classes.matches}>
            {matches.loaded && <Matches forTeamProfile enablePlayoffs={false} matchesToShow={matches.matchesByTeam[teamId]} />}
          </div>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    league: state.league,
    matches: state.matches,
  };
}

export default connect(mapStateToProps)(TeamProfile);
