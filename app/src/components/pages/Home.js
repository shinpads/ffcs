import React from 'react';
import { createUseStyles } from 'react-jss';
import Teams from './Teams';
import Matches from '../Matches';
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
        <div className={classes.title}>Matches</div>
        <Matches />
      </div>
    </>
  );
};

export default Home;
