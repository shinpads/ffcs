import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import colors from '../../colors';
import UserName from '../UserName';

const styles = createUseStyles({
  title: {
    textAlign: 'center',
    marginBottom: 0,
    fontSize: '28px',
    textTransform: 'uppercase',
  },
  container: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    width: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
  descriptionContainer: {
    marginTop: '0.5rem',
    fontSize: '16px',
  },
  priorityPlayerName: {
    color: colors.gold,
  },
  date: {
    textAlign: 'center',
    color: colors.somewhatwhite,
    fontSize: '18px',
  },
  footnote: {
    textAlign: 'center',
    color: colors.offwhite,
    fontSize: '14px',
  },
  warning: {
    color: colors.red,
  },
});

const RumbleSignups = (props) => {
  const classes = styles();

  const { week } = props;
  const { signups } = week;

  const prioritySignups = [];
  const signupCopy = [...signups];
  signupCopy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  signupCopy.forEach((signup, i, array) => {
    if (signup.player.has_rumble_priority) {
      prioritySignups.push(array.splice(i, 1)[0]);
    }
  });

  const sortedSignups = [...prioritySignups, ...signupCopy];

  useEffect(() => {

  }, []);

  return (
    <div>
      <div className={classes.title}>
        Players registered for this week
      </div>
      <div className={classes.date}>
        Match is played on Friday, at 8:30 PM EST
      </div>
      <div className={classes.descriptionContainer}>
        <div>
          Every 10 players to sign up makes a match.
          It's first come first serve, so sign up early!
          If you signed up too late this week and didn't get a match, don't worry --
          You will get priority the next week you play.
        </div>
        <div className={classes.priorityPlayerName}>
          Players in gold have priority.
        </div>
      </div>
      {sortedSignups.length > 0
        ? (
          <div className={classes.container}>
            {sortedSignups.map((signup, i) => (
              <div>
                {(!(i % 10) && sortedSignups.length - 10 < i) && (
                  <div>
                    <hr />
                    <div className={classes.warning}>More signups required for players <strong>below</strong> to enter a match this week!</div>
                    <hr />
                  </div>
                )}
                <UserName
                  user={signup.player.user}
                  nameClass={signup.player.has_rumble_priority ? classes.priorityPlayerName : ''}
                />
              </div>
            ))}
          </div>
        )
        : <div><br />No signups for this week yet! Be the first :)</div>}
      <div className={classes.footnote}>
        *The players in each match are randomized. For example, if there are
        20 players, the two matches will each be a random selection of the 20
        players.
      </div>
    </div>
  );
};

export default RumbleSignups;
