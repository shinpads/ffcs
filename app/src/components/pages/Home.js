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
          ffcsleague.com will feature the ffcs match schedule, along with ffcs match history, player stats, and more! These will be coming in the following weeks, but for now, please view your teams!
          <br /> <br />
          You will be assigned a team to face once a week starting January. You will schedule with the other team what day/time the match will take place, as long as it is in the designated week.
        </div>
        <Teams />
      </div>
    </>
  );
};

export default Home;
