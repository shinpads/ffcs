import { Button, Modal, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { signupForRumble } from '../../api';
import colors from '../../colors';
import { timeToDay } from '../../helpers';
import RumbleSignups from './RumbleSignups';

const styles = createUseStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  modalContentContainer: {
    width: '500px',
    height: '150px',
    boxShadow: '5px 5px 5px #000 !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
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
    padding: '1rem',
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
  modalText: {
    padding: '1rem',
  },
});

const Rumble = (props) => {
  const classes = styles();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    `This week's Rumble occurs at exactly 8:30 PM EST this upcoming Friday.
    By signing up, you agree to show up on time. Failure to do so may result
    in a week-long suspension.`,
  );

  const { season, user } = props;

  useEffect(() => {
    const curWeek = season.rumble_weeks.find(week => week.is_current);
    setCurrentWeek(curWeek);
    setIsRegistered(!!curWeek.signups.find(signup => signup.player.user.id === user.id));
    console.log(timeToDay());
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rumbleSignup = async () => {
    setLoading(true);
    const data = {
      week: currentWeek,
    };

    const response = await signupForRumble(data);

    setModalMessage(response.data.message);

    if (response.status === 200) {
      setIsRegistered(true);
      setCurrentWeek(response.data.data.week);
    }

    setLoading(false);
  };

  return (
    <>
      {currentWeek && (
      <div className={classes.container}>
        {!user.is_rumble_player && (
        <Button variant="contained" color="primary" href="/rumblesignup" size="large">
          ⚡ Sign up for FFCS Rumble! ⚡
        </Button>
        )}
        <div className={classes.title}>This week's rumble</div>
        <div />
        {
        user.is_rumble_player
          ? !isRegistered && <Button variant="outlined" onClick={handleClick}>Register for this week's rumble!</Button>
          : <div>You must sign up for Rumble in order to register for the week! Sign up above.</div>
        }
        <Modal className={classes.modal} open={open} onClose={handleClose}>
          <Paper className={classes.modalContentContainer}>
            <div className={classes.modalText}>
              {modalMessage}
            </div>
            {!isRegistered && <Button disabled={loading} variant="contained" onClick={rumbleSignup}>Register</Button>}
          </Paper>
        </Modal>
        <div className={classes.splitContainer}>
          <div>
            <RumbleSignups week={currentWeek} />
          </div>
          <div />
        </div>
      </div>
      )}
    </>
  );
};

export default Rumble;
