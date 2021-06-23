import React from 'react';
import { createUseStyles } from 'react-jss';
import logo from '../../public/logo.svg';
import colors from '../colors';
import { getImage } from '../helpers';
import UserName from './UserName';

import { connect } from 'react-redux';


const styles = createUseStyles({
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    padding: '8px',
    backgroundColor: colors.header,
    color: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    textTransform: 'uppercase',
    boxShadow: `1px 1px 2px ${colors.black}`,
    position: 'fixed',
    width: '100%',
    zIndex: 99999,
  },
  title: {
    fontWeight: 600,
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
  },
});

const Header = (props) => {
  const classes = styles();

  const { loaded: userLoaded, user } = props.user;

  return (
    <header className={classes.header}>
      <img alt="" width={48} src={getImage(logo)} />
      <a href="/"><div className={classes.title}>For Fun Championship Series</div></a>
      <div style={{ paddingRight: '1rem', textAlign: 'right' }}>
        {userLoaded && <UserName user={user} />}
      </div>
    </header>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Header);
