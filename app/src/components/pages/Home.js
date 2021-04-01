import React from 'react';
import { createUseStyles } from 'react-jss';
import Teams from './Teams';
import Matches from '../Matches';
import Header from '../Header';
import colors from '../../colors';
import { getImage } from '../../helpers';
import { Button } from '@material-ui/core';
import discordLogo from '../../../public/discord.png';


const styles = createUseStyles({
  title: {
    fontSize: '48px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
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
    padding: '1rem',
    marginBottom: '2rem',
  },
});

const Home = () => {
  const classes = styles();

  const openLogin = () => {
      window.location.href = window.location.origin + '/oauth2/login';
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.title}>Register for season 2 now open</div>

        <div className={classes.signin}>
          <Button variant="contained" color="secondary" onClick={openLogin}>
            <div className={classes.buttonText}>Sign in with Discord</div>
            <img  alt="discord" width={32} src={getImage(discordLogo)} />
          </Button>
        </div>

        <iframe
            src="https://player.twitch.tv/?video=965802464&parent=localhost&muted=true&autoplay=true&time=17m3s"
            width="900"
            height="507"
            allowFullScreen={true}>
        </iframe>


      </div>
    </>
  );
};

export default Home;
