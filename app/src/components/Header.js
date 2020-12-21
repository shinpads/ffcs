import React from 'react';
import { createUseStyles } from 'react-jss';
import logo from '../../public/logo.svg';
import colors from '../colors';
import { getImage } from '../helpers';

const styles = createUseStyles({
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    padding: '8px',
    backgroundColor: colors.darkestGrey,
    color: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 600,
    fontSize: '32px',
    textAlign: 'center',
  },
});

const Header = (props) => {
  const classes = styles();

  return (
    <header className={classes.header}>
      <img alt="" width={64} src={getImage(logo)} />
      <div className={classes.title}>For Fun Championship Series</div>
      <div style={{ paddingRight: '1rem', textAlign: 'right' }}>Starting January 2021</div>
    </header>
  );
};

export default Header;
