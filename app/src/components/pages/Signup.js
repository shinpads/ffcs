import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ReactSortable as Sortable } from 'react-sortablejs';
import { Button, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Teams from './Teams';
import Matches from '../Matches';
import Header from '../Header';
import Role from '../Role';
import { signup } from '../../api';
import colors from '../../colors';
import { getImage } from '../../helpers';
import discordLogo from '../../../public/discord.png';
import DiscordUser from '../discord/DiscordUser';

const styles = createUseStyles({
  title: {
    fontSize: '48px',
    fontWeight: 500,
    padding: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  description: {
    textAlign: 'center',
    color: colors.offwhite,
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    paddingTop: '5rem',
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
  role: {
    fontSize: '22px',
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    cursor: 'pointer',
    backgroundColor: colors.darkestGrey,
    margin: '0.5rem 0rem',
    padding: '0.5rem',
    textTransform: 'uppercase',
  },
  rolesContainer: {
    width: '300px',
  },
  roleText: {
    flexGrow: 1,
    textAlign: 'center',
  },
  question: {
    fontSize: '22px',
    marginTop: '2rem',
    marginBottom: '0.5rem',
  },
  submitButton: {
    marginTop: '2rem !important',
    width: '300px !important',
    color: `${colors.black} !important`,
  },
  submitted: {
    paddingTop: '6rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  }
});

const ROLES = [
  { role: 'top', id: 1 },
  { role: 'jungle', id: 2 },
  { role: 'mid', id: 3 },
  { role: 'bot', id: 4 },
  { role: 'support', id: 5 }
]

const Signup = (props) => {
  const classes = styles();

  const [summonerName, setSummonerName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [rolePrefrences, setRolePrefrences] = useState(ROLES);
  const [rank, setRank] = useState('');
  const [rankShouldBe, setRankShouldBe] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [heardFrom, setHeardFrom] = useState('');

  const { loaded: userLoaded, user } = props.user;

  const submit = async (e) => {
    e.preventDefault();
    const data = {
      summonerName,
      firstName,
      rank,
      rankShouldBe,
      heardFrom,
      firstRole: rolePrefrences[0].role,
      secondRole: rolePrefrences[1].role,
      thirdRole: rolePrefrences[2].role,
      fourthRole: rolePrefrences[3].role,
      fifthRole: rolePrefrences[4].role,
    };

    const response = await signup(data);

    setMessage(response.message);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Header />
        <div className={classes.submitted}>
          <div style={{ fontSize: '22px' }}>{message}</div>
          <br />
          <div style={{ fontSize: '22px' }}>Teams will be announced in the upcoming weeks!</div>
          <Button onClick={() => window.location.href = '/'} className={classes.submitButton} fullWidth type="submit" variant="contained" color="secondary">Home</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.title}>Season 2 signup form</div>
        <form className={classes.form} onSubmit={submit}>

          <div>Registering as:</div>
          <DiscordUser user={user} />

          <div className={classes.question}>What is your summoner name? (Must be exact)</div>
          <TextField value={summonerName} onChange={(e) => setSummonerName(e.target.value)} variant="filled" color="secondary" label="SUMMONER NAME" inputProps={{ maxLength: 32 }} />

          <div className={classes.question}>What is your first name? (optional)</div>
          <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} variant="filled" color="secondary" label="FIRST NAME" inputProps={{ maxLength: 32 }}/>

          <div className={classes.question}>Please order the roles in order of preference (Drag to move)</div>
          <div className={classes.rolesContainer}>
            <Sortable
              animation={150}
              list={rolePrefrences}
              setList={(next) => setTimeout(() => setRolePrefrences(next))}
            >
              {rolePrefrences.map((role) => (
                <div className={classes.role} key={role.id}>
                  <Role role={role.role} />
                  <div className={classes.roleText}>{role.role}</div>
                </div>
                )
              )}
            </Sortable>
          </div>
          <div className={classes.question}>What is your current rank?</div>
          <TextField value={rank} onChange={(e) => setRank(e.target.value)} variant="filled" color="secondary" label="RANK" inputProps={{ maxLength: 32 }} />
          <div className={classes.question}>What rank do you think you should be? (honest opinion)</div>
          <TextField value={rankShouldBe} onChange={(e) => setRankShouldBe(e.target.value)} variant="filled" color="secondary" label="RANK" inputProps={{ maxLength: 32 }} />

          <div className={classes.question}>How did you hear of FFCS? (if a friend introduced you to FFCS, please type their name)</div>
          <TextField value={heardFrom} onChange={(e) => setHeardFrom(e.target.value)} variant="filled" color="secondary" label="RANK" inputProps={{ maxLength: 32 }} />

          <Button className={classes.submitButton} fullWidth type="submit" variant="contained" color="secondary" onClick={submit}>
            <div className={classes.buttonText}>Submit</div>
          </Button>
        </form>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Signup);
