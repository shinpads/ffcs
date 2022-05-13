import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import logo from '../../public/logo_transparent.png';
import colors from '../colors';
import { getImage } from '../helpers';
import UserName from './UserName';
import DiscordUser from './discord/DiscordUser';
import TeamListMenu from './TeamListMenu';

const styles = createUseStyles({
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 3fr 1fr 1fr',
    padding: '8px',
    backgroundColor: colors.header,
    color: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    textTransform: 'uppercase',
    boxShadow: `1px 1px 2px ${colors.black}`,
    position: 'fixed',
    width: '100%',
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
      <img style={{ padding: '4px' }} alt="" width={48} src={getImage(logo)} />
      <div />
      <a href="/"><div className={classes.title}>For Fun Championship Series</div></a>
      <TeamListMenu />
      <div style={{ paddingRight: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        {userLoaded && <DiscordUser user={user} />}
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
