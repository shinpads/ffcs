import React from 'react';
import { createUseStyles } from 'react-jss';
import colors from '../colors';

const styles = createUseStyles({
  name: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const UserName = ({ user, nameClass }) => {
  const classes = styles();

  return (
    <a href={`/user/${user?.id}`} className={`${classes.name} ${nameClass}`}>
      {user?.summoner_name}
    </a>
  );
};

export default UserName;
