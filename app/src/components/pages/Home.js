import React from 'react';
import { createUseStyles } from 'react-jss';
import Teams from './Teams';
import Header from '../Header';
import colors from '../../colors';

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
  },
});

const Home = () => {
  const classes = styles();

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.title}>Teams are here</div>
        <div className={classes.description}>
          Here are the teams for the upcoming FFCS Season 1! Each team will play one game a week starting January. It will be up to the two teams playing to schedule their game at any time during that week.
          <br /> <br />
          The schedule will be posted on this website along with detailed stats for each player and game so check back here soon!
        </div>
        <Teams />
      </div>
    </>
  );
};

export default Home;
