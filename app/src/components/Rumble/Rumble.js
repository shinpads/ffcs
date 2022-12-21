import {
  Button, Modal, Paper, Tooltip,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTimer } from 'react-timer-hook';
import { signupForRumble, withdrawFromCurrentRumbleWeek } from '../../api';
import colors from '../../colors';
import { timeToRumbleSignupClose, range } from '../../helpers';
import RumbleLeaderboard from './RumbleLeaderboard';
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
  registerButton: {
    maxWidth: '300px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingBottom: '0rem',
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
  registerContainer: {
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    paddingTop: '0.5rem',
  },
  timerContainer: {
    fontSize: '30px',
  },
  dateContainer: {
    marginBottom: '1rem',
    fontSize: '18px',
    color: colors.somewhatwhite,
  },
  splitContainer: {
    display: 'inline-grid',
    maxWidth: '1000px',
    marginLeft: 'auto',
    marginRight: 'auto',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '4rem',
    marginTop: '1rem',
    justifyItems: 'center',
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
  rumbleInfoText: {
    display: 'inline-block',
    color: colors.primary,
    fontSize: '16px',
  },
  rumbleInfoTooltip: {
    backgroundColor: colors.darkGrey,
  },
  rumbleInfoTooltipText: {
    textAlign: 'center',
  },
  footnote: {
    textAlign: 'center',
    color: colors.offwhite,
    fontSize: '12px',
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  navContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  navButtonContainer: {
    marginTop: '225px',
  },
  bulletContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

const REGISTER_WARNING_MESSAGE = `This week's Rumble occurs at exactly 9:00 PM EST this upcoming Thursday.
By signing up, you agree to show up on time. Failure to do so may result
in a week-long suspension.`;

const DEREGISTER_WARNING_MESSAGE = "You are deregistering for this week's rumble. Click 'deregister' to proceed.";

const Rumble = (props) => {
  const classes = styles();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [allWeeks, setAllWeeks] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hideRegisterButton, setHideRegisterButton] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showTimer, setshowTimer] = useState(true);

  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({ expiryTimestamp: timeToRumbleSignupClose(), onExpire: () => setshowTimer(false) });

  const { season, user } = props;
  const currentWeek = season.rumble_weeks[season.rumble_weeks.length - 1];

  const updateWeeks = (weeks) => {
    weeks.forEach(week => {
      if (week.matches) {
        week.matches.sort((a, b) => a.id - b.id);
      }
    });
    setSelectedWeekIndex(season.rumble_weeks.length - 1);
    setAllWeeks(weeks);
  };

  useEffect(() => {
    updateWeeks(season.rumble_weeks);
    setshowTimer(currentWeek.signups_open);
    setIsRegistered(!!currentWeek.signups.find(signup => signup.player.user.id === user.id));
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
      updateWeeks(response.data.data.weeks);
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
        <HtmlTooltip
          title={(
            <>
              <div className={classes.rumbleInfoTooltipText}>
                <div>
                  <strong>FFCS Rumble</strong> is essentially FFCS Solo Queue! Players compete in
                  weekly matches to rise the Rumble ranks and top the leaderboards.
                </div>
                <br />
                <div>
                  Every week, players will sign up to play a Rumble match on
                  <strong> Friday</strong>, at <strong>10:00 PM EST</strong>.
                  Players are not required to sign up every week, and can selectively sign up each
                  week as they prefer!
                </div>
                <br />
                <div>
                  Teams will be formed for the week using a matchmaking algorithm that balances players
                  based on the skill level of the players, and the role preferences each player indicated
                  when they signed up*.
                </div>
                <br />
                <div>
                  After each match, everyone's rank will be adjusted based on if they won or lost.
                </div>
                <br />
                <div>
                  Every week, signups open on <strong>Saturday</strong>, at <strong>12:00 AM EST</strong>,
                  and close on <strong>Friday</strong>, at <strong>9:00 PM EST</strong> (1 hour before matches begin).
                </div>
                <br />
                <br />
                <div className={classes.footnote}>
                  *You can change your preferred roles in your user profile.
                </div>
              </div>
            </>
          )}
        >
          <div className={classes.rumbleInfoText}>What is Rumble?</div>
        </HtmlTooltip>
        {showTimer && (
        <div>
          <div className={classes.timerContainer}>
            Signups close in:
            <span> {days}</span> day{days === 1 ? '' : 's'},
            <span> {hours}</span> hour{hours === 1 ? '' : 's'},
            <span> {minutes}</span> minute{minutes === 1 ? '' : 's'},
            <span> {seconds}</span> second{seconds === 1 ? '' : 's'}
          </div>
          <div className={classes.dateContainer}>
            (Every Thursday at 8:00 PM EST)
          </div>
        </div>
        )}
        <div className={classes.registerContainer}>
          {user.is_rumble_player
            ? currentWeek.signups_open && <Button className={classes.registerButton} variant="contained" onClick={handleClick}>{isRegistered ? 'Deregister' : 'Register'} for this week's rumble</Button>
            : <div>You must sign up for Rumble in order to register for the week! Sign up above.</div>}
        </div>
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
            <div className={classes.columnContainer}>
              <div className={classes.navContainer}>
                {(selectedWeekIndex > 0) && (
                <div className={classes.navButtonContainer}>
                  <Button
                    style={{
                      maxWidth: '32px', minWidth: '32px', backgroundColor: colors.darkGrey, color: colors.white,
                    }}
                    variant="contained"
                    onClick={() => setSelectedWeekIndex(selectedWeekIndex - 1)}
                  >
                    &lt;
                  </Button>
                </div>
                )}
                <div>
                  {!allWeeks[selectedWeekIndex]?.signups_open
                    ? (
                      <div>
                        <div className={classes.subtitle}>
                          {selectedWeekIndex === allWeeks.length - 1 ? 'This week\'s matches' : ` Week ${selectedWeekIndex + 1} matches`}
                        </div>
                        <hr />
                        {allWeeks[selectedWeekIndex]?.matches?.map((match, j) => (
                          <div>
                            <div className={classes.subSubtitle}>Match {j + 1}</div>
                            <RumbleMatch match={match} />
                          </div>
                        ))}
                      </div>
                    )
                    : <RumbleSignups week={allWeeks[selectedWeekIndex]} />}
                </div>
                {(selectedWeekIndex < allWeeks.length - 1) && (
                <div className={classes.navButtonContainer}>
                  <Button
                    style={{
                      maxWidth: '32px', minWidth: '32px', backgroundColor: colors.darkGrey, color: colors.white,
                    }}
                    variant="contained"
                    onClick={() => setSelectedWeekIndex(selectedWeekIndex + 1)}
                  >
                    &gt;
                  </Button>
                </div>
                )}
              </div>
              <div className={classes.bulletContainer} />
            </div>
          </div>
          <div>
            <RumbleLeaderboard />
          </div>
        </div>
      </div>
      )}
    </>
  );
};

const HtmlTooltip = withStyles({
  tooltip: {
    fontSize: '12px',
    backgroundColor: colors.darkGrey,
    border: '1px solid white',
  },
})(Tooltip);

export default Rumble;
