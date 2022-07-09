import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import Header from '../Header';
import colors from '../../colors';
import { getImage } from '../../helpers';
import discordLogo from '../../../public/discord.png';
import DiscordUser from '../discord/DiscordUser';
import TournamentSeason from '../TournamentSeason';
import { getCurrentSeason } from '../../api';
import Rumble from '../Rumble';

const styles = createUseStyles({
  title: {
    fontSize: '48px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
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
  container: {
    maxWidth: '1000px',
    minWidth: '1000px',
    margin: '0 auto',
    paddingTop: '5rem',
  },
});

const Home = (props) => {
  const classes = styles();

  const [currentSeason, setCurrentSeason] = useState(null);

  const openLogin = () => {
    window.location.href = `${window.location.origin}/oauth2/login`;
  };

  useEffect(() => {
    const getData = async () => {
      const response = await getCurrentSeason();
      setCurrentSeason(response.data.data);
    };
    getData();
  }, []);

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
    );
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        {currentSeason?.is_rumble
          ? <Rumble user={user} season={currentSeason} />
          : <TournamentSeason user={user} />}
      </div>
    </>
  );
};

const SignIn = ({ user }) => {
  const classes = styles();
  if (user && user.id) {
    return (
      <div className={classes.signin}>
        <div>Signed in as:</div>
        <DiscordUser user={user} />
      </div>
    );
  }
  return (
    <div className={classes.signin}>
      <Button variant="contained" color="secondary" href="/oauth2/login">
        <div className={classes.buttonText}>Sign in with Discord</div>
        <img alt="discord" width={32} src={getImage(discordLogo)} />
      </Button>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
    matches: state.matches,
  };
}

export default connect(mapStateToProps)(Home);
