import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { getMatches } from '../actions/matchActions';
import Matches from './Matches';
import Standings from './Standings';
import Leaderboard from './Leaderboard';
import colors from '../colors';
import { getImage } from '../helpers';
import logo from '../../public/logo_transparent.png';

const styles = createUseStyles({
  title: {
    fontSize: '48px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  rumbleSignupButton: {
    textAlign: 'center',
    paddingTop: '0.5rem',
  },
  splitContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '4rem',
  },
  loadingScreen: {
    transition: 'opacity 0.75s ease',
    backgroundColor: colors.darkGrey,
    opacity: 1,
    zIndex: 100,
    position: 'fixed',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  loadedScreen: {
    opacity: 0,
    pointerEvents: 'none',
  },
  loadingImage: {
    animation: 'loading-image 2.4s infinite ease-in-out both',
    padding: '4px',
    transform: 'scale(1)',
    transition: 'transform 1s ease',
  },
});

const TournamentSeason = (props) => {
  const classes = styles();

  const { matches, user, dispatch } = props;
  const { loaded, currentSeasonMatchesByWeek } = matches;

  useEffect(() => {
    dispatch(getMatches());
  }, []);

  return (
    <>
      <div className={`${classes.loadingScreen} ${loaded ? classes.loadedScreen : ''}`}>
        <img className={classes.loadingImage} style={loaded ? { transform: 'scale(0)', animation: 'none' } : { transform: 'scale(1)' }} alt="" width={128} src={getImage(logo)} />
      </div>
      <div>
        <div className={classes.splitContainer}>
          <Matches enablePlayoffs matchesToShow={currentSeasonMatchesByWeek} />
          <div>
            <Standings />
            <Leaderboard />
          </div>
        </div>
      </div>
    </>
  );
};

// <iframe
//     src="https://player.twitch.tv/?video=974287088&parent=www.ffcsleague.com&muted=true&autoplay=true&time=17m3s"
//     width="100%"
//     height="507"
//     allowFullScreen={true}>
// </iframe>

function mapStateToProps(state) {
  return {
    matches: state.matches,
  };
}

export default connect(mapStateToProps)(TournamentSeason);
