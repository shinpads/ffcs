import { Button } from '@material-ui/core';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { signupForRumble } from '../api';
import colors from '../colors';

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
    textAlign: 'center',
    paddingTop: '0.5rem',
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
  },
});

const Rumble = (props) => {
  const classes = styles();

  const { season, user } = props;
  const currentWeek = season.rumble_weeks.find(week => week.is_current);

  const rumbleSignup = async () => {
    const data = {
      week: currentWeek,
    };

    const response = await signupForRumble(data);
    console.log(response);
  };

  return (
    <>
      <div className={classes.container}>
        <Button variant="contained" color="primary" href="/rumblesignup" size="large">
          ⚡ Sign up for FFCS Rumble! ⚡
        </Button>
        <div>This week's rumble</div>
        <Button variant="outlined" onClick={rumbleSignup}>Sign up for this week's rumble!</Button>
      </div>
    </>
  );
};

export default Rumble;
