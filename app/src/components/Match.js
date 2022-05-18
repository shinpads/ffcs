import React from 'react';
import moment from 'moment';
import { Fade } from 'react-reveal';
import { createUseStyles } from 'react-jss';
import { Paper, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import colors from '../colors';
import TeamName from './TeamName';
import { copyTextToClipboard, getImage } from '../helpers';
import twitchLogo from '../../public/twitch.png';

import MatchScheduler from './MatchScheduler';

const styles = createUseStyles({
  container: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '6px 8px',
    color: colors.offwhite,
  },
  middleContainer: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 3fr',
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '1rem',
  },
  bottomContainer: {
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
  },
  codeContainer: {
    display: 'grid',
    float: 'right',
    gridGap: '8px',
  },
  scheduleContainer: {
    dispaly: 'grid',
    float: 'left',
    gridGap: '8px',
  },
});

const Match = ({ match, user }) => {
  const classes = styles();
  let date = `WEEK ${match.week}`;
  if (match.scheduled_for) {
    date = moment(match.scheduled_for).format('MMM Do h:mm a');
  }

  const winner = match.winner ? match.winner.id : null;
  //   let winner = null;

  //   if (match.games.filter(game => game.winner).length === match.match_format) {
  //     const gamesWon = {};
  //     match.games.forEach(game => {
  //       if (!gamesWon[game.winner]) {
  //         gamesWon[game.winner] = 0;
  //       }
  //       gamesWon[game.winner] += 1;
  //       if (gamesWon[game.winner] == Math.ceil(match.match_format / 2)) {
  //         winner = game.winner;
  //       }
  //     });
  //   }

  if (match.teams.length !== 2) return <div />;

  const team1 = match.teams[0];
  const team2 = match.teams[1];

  const isCaptain = !![team1, team2].filter(team => team.captain?.user.id === user.user.id)[0];

  const userTeam = [team1, team2].filter(team => !!team.players.filter(player => player.user.id === user.user.id)[0])[0];

  return (
    <div className={classes.container}>
      <div className={classes.topContainer}>
        <div>{date}</div>
        <div>BEST OF {match.match_format}</div>
      </div>
      <div className={classes.middleContainer}>
        <div className={classes.teamContainer}>
          <TeamName
            key={team1.id}
            team={team1}
            nameClass={winner === team1.id ? classes.winningTeam : (winner !== null ? classes.losingTeam : '')}
          />
        </div>
        <div>VS.</div>
        <div className={classes.teamContainer}>
          <TeamName
            key={team2.id}
            team={team2}
            nameClass={winner === team2.id ? classes.winningTeam : (winner !== null ? classes.losingTeam : '')}
          />
        </div>
      </div>
      <div className={classes.bottomContainer}>
        <div className={classes.scheduleContainer}>
          {(isCaptain && !match.winner) && <MatchScheduler sendingTeam={userTeam} match={match} />}
        </div>
        <div className={classes.codeContainer}>
          {!winner && match.games.filter(game => game.tournament_code).map((game, index) => (
            <>
              <Button style={{ fontSize: '12px', float: 'right' }} variant="outlined" onClick={() => copyTextToClipboard(game.tournament_code)}>Copy Game {game.game_in_series} Code</Button>
            </>
          ))}
        </div>
        {winner && match.twitch_vod && (
          <a href={match.twitch_vod}>
            <img alt="Watch on Twitch" target="_blank" width={24} src={getImage(twitchLogo)} />
          </a>
        )}
        {winner && (
          <Button href={`/match/${match.id}`} style={{ float: 'right', fontSize: '12px' }} variant="outlined">View Results</Button>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Match);
