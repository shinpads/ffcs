import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button } from '@material-ui/core';

import { connect } from 'react-redux';
import { ReactSortable as Sortable } from 'react-sortablejs';
import colors from '../../colors';
import Role from '../Role';
import { getTeam, saveTeamManage } from '../../api';
import Header from '../Header';
import Spinner from '../Spinner';
import sortTeamPlayers from '../../util/sortTeamPlayers';

const styles = createUseStyles({
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingTop: '6rem',
  },
  formContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    paddingTop: '5rem',
  },
  content: {
    paddingTop: '6rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '2rem',
  },
  buttonText: {
    color: colors.black,
  },
  question: {
    fontSize: '22px',
    marginTop: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  rolesContainer: {
    width: '300px',
  },
  role: {
    fontSize: '22px',
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    cursor: 'pointer',
    backgroundColor: colors.darkestGrey,
    margin: '0.5rem 0rem',
    padding: '12px',
    borderRadius: '4px',
  },
  roleText: {
    flexGrow: 1,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: '2rem !important',
    width: '300px !important',
    color: `${colors.black} !important`,
  },
  changesSaved: {
    color: '#58D68D',
  },
});

const ROLES = [
  'top',
  'jungle',
  'mid',
  'bot',
  'support',
];

const ROLES_SHORT = [
  'TOP',
  'JG',
  'MID',
  'ADC',
  'SUPP',
];

const TeamManage = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [isCaptain, setIsCaptain] = useState(false);
  const [playerRoles, setPlayerRoles] = useState();
  const [changesSaved, setChangesSaved] = useState();

  const submit = async (e) => {
    e.preventDefault();
    const data = {
      players: playerRoles.map((playerRole, i) => ({
        id: playerRole.id,
        role: ROLES_SHORT[i],
      })),
    };

    const response = await saveTeamManage(data);
    setChangesSaved(response.data.success);
  };

  const formChange = () => {
    setChangesSaved(false);
  };

  useEffect(() => {
    async function getData() {
      const { id } = props.match.params;
      const data = await getTeam(id);
      const sortedPlayers = sortTeamPlayers(data.players);
      const mappedPlayers = sortedPlayers.map(player => ({
        summonerName: player.user.summoner_name,
        id: player.id,
      }));
      setIsCaptain(data.is_captain);
      setPlayerRoles(mappedPlayers);
      setLoading(false);
    }
    getData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <Spinner />
        </div>
      </>
    );
  } if (!isCaptain) {
    return (
      <>
        <Header />
        <div className={classes.content}>You do not have permission to view this page!</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={submit} onChange={formChange}>
          <div className={classes.question}>Change player roles (drag to change order)</div>
          <div className={classes.rolesContainer}>
            <Sortable
              animation={150}
              list={playerRoles}
              setList={(next) => setTimeout(() => setPlayerRoles(next))}
              onChange={formChange}
            >
              {playerRoles.map((role, i) => (
                <div className={classes.role} key={role.id}>
                  <Role role={ROLES[i]} />
                  <div className={classes.roleText}>{role.summonerName}</div>
                </div>
              ))}
            </Sortable>
          </div>
          <Button className={classes.submitButton} fullWidth type="submit" variant="contained" color="secondary" onClick={submit}>
            <div className={classes.buttonText}>Save Changes</div>
          </Button>
          {!!changesSaved && <div className={classes.changesSaved}>Changes saved successfully!</div>}
        </form>
      </div>
    </>
  );
};

export default TeamManage;
