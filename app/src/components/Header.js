import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import logo from '../../public/logo_transparent.png';
import colors from '../colors';
import { getImage } from '../helpers';
import DiscordUser from './discord/DiscordUser';
import HeaderMenu from './HeaderMenu';
import { getAllCurrentSeasonTeams } from '../api';

const styles = createUseStyles({
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 3fr 1fr 1fr 1fr',
    padding: '8px',
    backgroundColor: colors.header,
    color: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    textTransform: 'uppercase',
    boxShadow: `1px 1px 2px ${colors.black}`,
    position: 'fixed',
    width: '100%',
    zIndex: '10',
  },
  title: {
    fontWeight: 600,
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  teamText: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '2px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const Header = (props) => {
  const classes = styles();
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);

  const { loaded: userLoaded, user } = props.user;

  useEffect(() => {
    async function getData() {
      const data = await getAllCurrentSeasonTeams();
      setTeams(data);
      setLoading(false);
    }

    getData();
  }, []);

  if (loading) {
    return (
      <>
      </>
    );
  }

  return (
    <header className={classes.header}>
      <img style={{ padding: '4px' }} alt="" width={48} src={getImage(logo)} />
      <div />
      <div />
      <a href="/"><div className={classes.title}>For Fun Championship Series</div></a>
      <div />
      <div />
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
