import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import { getMatches } from '../../actions/matchActions';
import Teams from './Teams';
import Matches from '../Matches';
import Playoffs from '../Playoffs';
import Standings from '../Standings';
import Leaderboard from '../Leaderboard';
import Header from '../Header';
import colors from '../../colors';
import { getImage } from '../../helpers';
import { Button } from '@material-ui/core';
import discordLogo from '../../../public/discord.png';
import DiscordUser from '../discord/DiscordUser';
import { getVote } from '../../api';
import Spinner from '../Spinner';
import logo from '../../../public/logo_transparent.png';


const styles = createUseStyles({
  title: {
    fontSize: '48px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '22px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.offwhite,
  },
  description: {
    textAlign: 'center',
    color: colors.offwhite,
  },
  container: {
    maxWidth: '1000px',
    minWidth: '1000px',
    margin: '0 auto',
    paddingTop: '5rem',
  },
  splitContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '4rem',
  },
  buttonText: {
    color: colors.black,
  },
  signin: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '2rem',
    flexDirection: 'column',
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
  }
});

const Home = (props) => {
  const classes = styles();

  const [voted, setVoted] = useState(false);

  const { loaded } = props.matches;

  const { dispatch } = props;

  useEffect(() => {
    async function start() {
      const existingVote = await getVote();
      setVoted(existingVote);
    }
    start();

    dispatch(getMatches());
  }, []);

  const openLogin = () => {
      window.location.href = window.location.origin + '/oauth2/login';
  }

  const { loaded: userLoaded, user } = props.user;

  if (userLoaded && !user.id) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <div className={classes.title}>Sign-in to proceed</div>
          <SignIn user={user} />
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className={`${classes.loadingScreen} ${loaded ? classes.loadedScreen : ''}`}>
        <img className={classes.loadingImage} style={ loaded ? { transform: 'scale(0)', animation: 'none' } : { transform: 'scale(1)'}} alt="" width={128} src={getImage(logo)} />
      </div>
      <div className={classes.container}>
        <Playoffs />
        <div className={classes.splitContainer}>
          <Matches />
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

const SignIn = ({ user }) => {
  const classes = styles();
  if (user && user.id) {
    return (
      <div className={classes.signin}>
        <div>Signed in as:</div>
        <DiscordUser user={user} />
      </div>
    )
  }
  return (
    <div className={classes.signin}>
      <Button variant="contained" color="secondary" href="/oauth2/login">
        <div className={classes.buttonText}>Sign in with Discord</div>
        <img  alt="discord" width={32} src={getImage(discordLogo)} />
      </Button>
    </div>
  )
}


function mapStateToProps(state) {
  return {
    user: state.user,
    matches: state.matches,
  };
}

export default connect(mapStateToProps)(Home);
