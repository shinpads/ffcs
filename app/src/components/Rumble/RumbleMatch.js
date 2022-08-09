import React, { useState } from 'react';
import moment from 'moment';
import { createUseStyles } from 'react-jss';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import colors from '../../colors';
import { copyTextToClipboard, getImage } from '../../helpers';
import twitchLogo from '../../../public/twitch.png';

import { updateCasters } from '../../api';
import Role from '../Role';

const styles = createUseStyles({
  container: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    width: '400px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
    height: '',
  },
  casterContainer: {
    backgroundColor: colors.darkerGrey,
    boxShadow: `1px 1px 2px ${colors.black}`,
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  casterButton: {
    display: 'grid',
    float: 'left',
    marginRight: '4px',
    width: '195px',
    height: '35px',
  },
  castersText: {
    display: 'grid',
    float: 'right',
    color: colors.almostwhite,
    fontSize: '13px',
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '6px 8px',
    fontSize: '16px',
    color: colors.white,
  },
  middleContainer: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 3fr',
    textAlign: 'center',
    fontSize: '20px',
    marginBottom: '1rem',
  },
  bottomContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '6px 8px',
  },
  winningTeam: {
    textDecoration: 'underline',
  },
  losingTeam: {
  },
  teamContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  scheduleContainer: {
    dispaly: 'grid',
    float: 'left',
    gridGap: '8px',
  },
});

const ROLES = ['TOP', 'JG', 'MID', 'ADC', 'SUPP'];
const RUMBLE_ROLES = ['rumble_top', 'rumble_jg', 'rumble_mid', 'rumble_adc', 'rumble_supp'];

const RumbleMatch = ({ match, user }) => {
  const classes = styles();
  const [casters, setCasters] = useState(match.casters.map(caster => caster.discord_username));
  const [casterLoading, setCasterLoading] = useState(false);
  let date = `WEEK ${match.week}`;
  if (match.scheduled_for) {
    date = `📅 ${moment(match.scheduled_for).format('MMM Do h:mm a')}`;
  }

  const handleCasters = async () => {
    setCasterLoading(true);
    const data = {
      matchId: match.id,
      userId: user.user.id,
    };
    const res = await updateCasters(data);
    setCasters(res.data.casters.map(caster => caster.discord_username));
    setCasterLoading(false);
  };

  const winner = match.winner ? match.winner.id : null;

  if (match.teams.length !== 2) return <div />;

  const team1 = match.teams[0];
  const team2 = match.teams[1];
  const isCaster = casters.includes(user.user.discord_username);
  const canSignUpAsCaster = (isCaster || casters.length < 3);

  return (
    <div className={classes.container}>
      {!winner && (
      <div className={classes.casterContainer}>
        <div className={classes.casterButton}>
          {canSignUpAsCaster && (
          <Button
            style={{ fontSize: '12px', float: 'right' }}
            disabled={casterLoading}
            variant="outlined"
            onClick={handleCasters}
          >
            {isCaster ? 'Withdraw from casting' : 'Sign up as caster'}
          </Button>
          )}
        </div>
        <div className={classes.castersText}>
          Caster{casters.length !== 1 ? 's' : ''}:
          <br />
          {casters.length > 0 ? casters.map(caster => <div>{caster}<br /></div>) : 'None'}
        </div>
      </div>
      )}
      <div className={classes.topContainer}>
        <div>{date}</div>
        <div>BEST OF {match.match_format}</div>
      </div>
      <div className={classes.middleContainer}>
        <div className={classes.teamContainer}>
          <div style={{ color: '#16a0d3' }}>Blue Side</div>
          <br />
          {RUMBLE_ROLES.map(role => <div>{team1[role].user.summoner_name}</div>)}
        </div>
        <div className={classes.teamContainer}>
          <div> VS </div>
          <br />
          {ROLES.map(role => <Role role={role} />)}
        </div>
        <div className={classes.teamContainer}>
          <div style={{ color: '#f96260' }}>Red Side</div>
          <br />
          {RUMBLE_ROLES.map(role => <div>{team2[role].user.summoner_name}</div>)}
        </div>
      </div>
      <div className={classes.bottomContainer}>
        {winner && match.twitch_vod
          ? (
            <a href={match.twitch_vod}>
              <img alt="Watch on Twitch" target="_blank" width={24} src={getImage(twitchLogo)} />
            </a>
          )
          : <div />}
        <div />
        {winner && (
          <Button href={`/match/${match.id}`} style={{ fontSize: '12px' }} variant="contained">View Results</Button>
        )}
        {!winner && match.games.filter(game => game.tournament_code).map((game, index) => (
          <>
            <Button style={{ fontSize: '12px' }} variant="outlined" onClick={() => copyTextToClipboard(game.tournament_code)}>Copy Game {game.game_in_series} Code</Button>
          </>
        ))}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(RumbleMatch);
