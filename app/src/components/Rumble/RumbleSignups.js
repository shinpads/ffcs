import React from 'react';
import { createUseStyles } from 'react-jss';
import colors from '../../colors';

const styles = createUseStyles({
  title: {
    textAlign: 'center',
    margin: 0,
    fontSize: '28px',
    textTransform: 'uppercase',

  },
  container: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
});

const RumbleSignups = (props) => {
  const classes = styles();

  const { week } = props;

  return (
    <div>
      <div className={classes.title}>
        Players registered for this week
      </div>
      <div className={classes.container}>
        {week.signups.map((signup, i) => (
          <div>
            {!(i % 10 || !i) && <hr />}
            <div>{signup.player.user.summoner_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RumbleSignups;
