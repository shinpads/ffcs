import { Button, colors } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import { WithContext as ReactTags } from 'react-tag-input';
import { getUser, updateUser } from '../../api';
import Header from '../Header';
import RolePreferenceSelector from '../RolePreferenceSelector';
import Spinner from '../Spinner';

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
  question: {
    fontSize: '26px',
    marginTop: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '4fr 8fr',
    gridGap: '1rem',
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: '2rem !important',
    width: '300px !important',
    color: `${colors.black} !important`,
  },
  changesSaved: {
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  smurfInput: {
    display: 'flex',
    justifyContent: 'center',
    width: '400px',
  },
});

const UserManage = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [rolePreferences, setRolePreferences] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [rumblePlayer, setRumblePlayer] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [smurfs, setSmurfs] = useState([]);

  const { match, user: userObject } = props;
  const { loaded: userLoaded, user } = userObject;
  const { params } = match;
  const { id } = params;

  useEffect(() => {
    const getData = async () => {
      const data = await getUser(id);
      const userRumblePlayer = data.user.players.find(curPlayer => curPlayer.is_rumble);
      setRumblePlayer(userRumblePlayer);
      setSmurfs(data.user.smurfs.map(smurf => ({
        id: smurf,
        text: smurf,
      })));

      const rolePrefs = {};
      Object.keys(userRumblePlayer.role_preferences).forEach(rolePrefKey => {
        rolePrefs[rolePrefKey] = userRumblePlayer.role_preferences[rolePrefKey].toString();
      });
      setRolePreferences(rolePrefs);
    };
    getData();
    setLoading(false);
  }, []);

  const changeRolePrefs = (role, value) => {
    const newRolePrefs = {
      ...rolePreferences,
    };
    newRolePrefs[role] = value;
    setRolePreferences(newRolePrefs);
  };

  const removeSmurf = i => {
    setSmurfs(smurfs.filter((smurf, index) => index !== i));
  };

  const addSmurf = smurf => {
    setSmurfs([...smurfs, smurf]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const rolePrefs = {};
    Object.keys(rolePreferences).forEach(rolePrefKey => {
      rolePrefs[rolePrefKey] = parseFloat(rolePreferences[rolePrefKey]);
    });
    const data = {
      id,
      player: {
        id: rumblePlayer.id,
        rolePreferences: rolePrefs,
      },
    };

    const response = await updateUser(data, id);
    setChangesSaved(response.data.data.success);
    setResponseMessage(response.data.message);
    setButtonLoading(false);
  };

  if (loading || !userLoaded) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <Spinner />
        </div>
      </>
    );
  }

  if (user.id !== parseInt(id, 10)) {
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
        {rumblePlayer && (
          <div>
            <div>
              <div className={classes.question}>Change role preferences</div>
              <RolePreferenceSelector rolePreferences={rolePreferences} changeRolePrefs={changeRolePrefs} />
            </div>
            <div>
              <div className={classes.question}>Add/remove smurfs</div>
              <div className={classes.smurfInput}>
                <ReactTags
                  tags={smurfs}
                  handleDelete={removeSmurf}
                  handleAddition={addSmurf}
                  inputFieldPosition="bottom"
                  allowDragDrop={false}
                />
              </div>
            </div>
          </div>
        )}
        <div className={classes.submitContainer}>
          <Button disabled={buttonLoading} className={classes.submitButton} fullWidth type="submit" variant="contained" color="secondary" onClick={submit}>
            <div className={classes.buttonText}>Save Changes</div>
          </Button>
        </div>
        {changesSaved && <div className={classes.changesSaved}>{responseMessage}</div>}
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(UserManage);
