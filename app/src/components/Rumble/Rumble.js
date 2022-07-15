import { Button, Modal, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTimer } from 'react-timer-hook';
import { signupForRumble, withdrawFromCurrentRumbleWeek } from '../../api';
import colors from '../../colors';
import { nearestWednesday } from '../../helpers';
import RumbleMatch from './RumbleMatch';
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
    fontSize: '34px',
    fontWeight: 'bold',
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subSubtitle: {
    fontSize: '26px',
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
    textAlign: 'center',
    paddingTop: '0.5rem',
  },
  splitContainer: {
    display: 'grid',
    maxWidth: '1000px',
    marginLeft: 'auto',
    marginRight: 'auto',
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

const REGISTER_WARNING_MESSAGE = `This week's Rumble occurs at exactly 8:30 PM EST this upcoming Friday.
By signing up, you agree to show up on time. Failure to do so may result
in a week-long suspension.`;

const DEREGISTER_WARNING_MESSAGE = "You are deregistering for this week's rumble. Click 'deregister' to proceed.";

const Rumble = (props) => {
  const classes = styles();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hideRegisterButton, setHideRegisterButton] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showTimer, setshowTimer] = useState(true);

  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({ expiryTimestamp: nearestWednesday(), onExpire: () => setshowTimer(false) });

  const { season, user } = props;

  useEffect(() => {
    const curWeek = season.current_week;
    setCurrentWeek(curWeek);
    setshowTimer(curWeek.signups_open);
    setIsRegistered(!!curWeek.signups.find(signup => signup.player.user.id === user.id));
  }, []);

  const handleClick = () => {
    setModalMessage(isRegistered ? DEREGISTER_WARNING_MESSAGE : REGISTER_WARNING_MESSAGE);
    setOpen(true);
  };

  const handleClose = () => {
    setHideRegisterButton(false);
    setOpen(false);
  };

  const rumbleSignup = async (signingUp) => {
    setLoading(true);
    const data = {
      week: currentWeek,
    };

    const response = signingUp ? await signupForRumble(data) : await withdrawFromCurrentRumbleWeek(data);

    setModalMessage(response.data.message);

    if (response.status === 200) {
      setIsRegistered(signingUp);
      setHideRegisterButton(true);
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
        <div className={classes.title}>FFCS Rumble</div>
        {showTimer && (
        <div>
          <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
        )}
        <div />
        {
        user.is_rumble_player
          ? <Button variant="outlined" onClick={handleClick}>{isRegistered ? 'Deregister' : 'Register'} for this week's rumble</Button>
          : <div>You must sign up for Rumble in order to register for the week! Sign up above.</div>
        }
        <Modal className={classes.modal} open={open} onClose={handleClose}>
          <Paper className={classes.modalContentContainer}>
            <div className={classes.modalText}>
              {modalMessage}
            </div>
            {!hideRegisterButton && (
            <Button disabled={loading} variant="contained" onClick={() => rumbleSignup(!isRegistered)}>
              {isRegistered ? 'Deregister' : 'Register'}
            </Button>
            )}
          </Paper>
        </Modal>
        <div className={classes.splitContainer}>
          <div>
            {!currentWeek.signups_open
              ? (
                <div>
                  <div className={classes.subtitle}>This week's matches</div>
                  <hr />
                  {currentWeek.matches.map((match, i) => (
                    <div>
                      <div className={classes.subSubtitle}>Match {i + 1}</div>
                      <RumbleMatch match={match} />
                    </div>
                  ))}
                </div>

              )
              : <RumbleSignups week={currentWeek} />}
          </div>
          <div />
        </div>
      </div>
      )}
    </>
  );
};

export default Rumble;
