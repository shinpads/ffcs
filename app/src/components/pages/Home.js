import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import Teams from './Teams';
import Matches from '../Matches';
import Header from '../Header';
import colors from '../../colors';
import { getImage } from '../../helpers';
import { Button } from '@material-ui/core';
import discordLogo from '../../../public/discord.png';
import DiscordUser from '../discord/DiscordUser';
import { getVote } from '../../api';

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
    maxWidth: '900px',
    margin: '0 auto',
    paddingTop: '5rem',
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
});

const Home = (props) => {
  const classes = styles();

  const [voted, setVoted] = useState(false);

  useEffect(() => {
    async function start() {
      const existingVote = await getVote();
      setVoted(existingVote);
    }
    start();
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
      <div className={classes.container}>
        <div className={classes.title}>Schedule will be posted soon</div>
        <hr />
        <Teams />
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
  };
}

export default connect(mapStateToProps)(Home);
