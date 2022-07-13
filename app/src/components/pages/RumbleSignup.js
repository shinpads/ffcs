import {
  Button,
  FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import { ReactSortable as Sortable } from 'react-sortablejs';
import colors from '../../colors';
import DiscordUser from '../discord/DiscordUser';
import Header from '../Header';
import Role from '../Role';
import ranks from '../../util/ranks';
import { rumbleSignup } from '../../api';
import Spinner from '../Spinner';
import { isEmptyObject } from '../../helpers';

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
    padding: '12px',
    textTransform: 'uppercase',
    borderRadius: '4px',
  },
  rolesContainer: {
    width: '900px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  roleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    flexGrow: 1,
    textAlign: 'center',
  },
  question: {
    fontSize: '22px',
    marginTop: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  questionInfo: {
    marginBottom: '0.5rem',
    color: colors.offwhite,
    textAlign: 'center',
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
  },
  rankFormControl: {
    width: '225px',
  },
  rankMenuItem: {
    display: 'flex',
    alignItems: 'center',
  },
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const ROLES = [
  { role: 'top', id: 1 },
  { role: 'jungle', id: 2 },
  { role: 'mid', id: 3 },
  { role: 'bot', id: 4 },
  { role: 'support', id: 5 },
];

const DEFAULT_ROLE_PREFERENCES = {
  top: '1',
  jungle: '1',
  mid: '1',
  bot: '1',
  support: '1',
};

const RumbleSignup = (props) => {
  const classes = styles();

  const [summonerName, setSummonerName] = useState('');
  const [rolePreferences, setRolePreferences] = useState(DEFAULT_ROLE_PREFERENCES);
  const [rank, setRank] = useState('Unranked');
  const [highestRank, setHighestRank] = useState('Unranked');
  const [rankShouldBe, setRankShouldBe] = useState('Unranked');
  const [heardFrom, setHeardFrom] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = props.user;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      summonerName,
      rolePreferences: {
        top: parseInt(rolePreferences.top, 10),
        jungle: parseInt(rolePreferences.jungle, 10),
        mid: parseInt(rolePreferences.mid, 10),
        bot: parseInt(rolePreferences.bot, 10),
        support: parseInt(rolePreferences.support, 10),
      },
      rank,
      highestRank,
      rankShouldBe,
      heardFrom,
    };

    const response = await rumbleSignup(data);
    if (response.status === 200) {
      setResponseMessage(response.data.message);
    } else {
      setResponseMessage('Failed to sign up :( please contact Fenryn.');
    }

    setLoading(false);
    setSubmitted(true);
  };

  const changeRolePrefs = (role, value) => {
    const newRolePrefs = {
      ...rolePreferences,
    };
    newRolePrefs[role] = value;
    setRolePreferences(newRolePrefs);
  };

  if (isEmptyObject(user)) {
    return <Spinner />;
  }

  if (user.is_rumble_player) {
    return (
      <>
        <Header />
        <div className={classes.submitted}>
          <div style={{ fontSize: '22px' }}>You have already signed up!</div>
          <Button href="/" className={classes.submitButton} fullWidth type="submit" variant="contained" color="secondary">Home</Button>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Header />
        <div className={classes.submitted}>
          <div style={{ fontSize: '22px' }}>{responseMessage}</div>
          <Button href="/" className={classes.submitButton} fullWidth type="submit" variant="contained" color="secondary">Home</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.title}>
          Rumble Signup
        </div>
        <form className={classes.form} onSubmit={submit}>
          <div>Registering as:</div>
          <DiscordUser user={user} />

          <div className={classes.questionContainer}>
            <div className={classes.question}>What is your summoner name?</div>
            <div className={classes.questionInfo}>Please make sure this is <b>exact</b></div>
            <TextField value={summonerName} onChange={(e) => setSummonerName(e.target.value)} variant="filled" color="secondary" label="SUMMONER NAME" inputProps={{ maxLength: 32 }} />
          </div>
          <div className={classes.question}>Please indicate how comfortable you are on each role (you can select same comfort for multiple roles)</div>
          <div className={classes.questionInfo}>This information will be used during matchmaking. Please select <strong>at least</strong> one role as super comfortable.</div>
          <div className={classes.rolesContainer}>
            {ROLES.map(role => (
              <div className={classes.roleRow}>
                <Role role={role.role} />
                <RadioGroup
                  onChange={(e) => changeRolePrefs(role.role, e.target.value)}
                  value={rolePreferences[role.role]}
                  row
                >
                  <FormControlLabel value="1" control={<Radio />} label="Super comfortable" labelPlacement="top" />
                  <FormControlLabel value="0.5" control={<Radio />} label="Pretty comfortable" labelPlacement="top" />
                  <FormControlLabel value="0.25" control={<Radio />} label="Somewhat comfortable" labelPlacement="top" />
                  <FormControlLabel value="0" control={<Radio />} label="Not comfortable at all" labelPlacement="top" />
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className={classes.question}>What is your current rank?</div>
          <FormControl variant="filled" className={classes.rankFormControl}>
            <InputLabel id="rank-input-label">RANK</InputLabel>
            <Select
              labelId="rank-input-label"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            >
              {ranks.map((curRank) => (
                <MenuItem value={curRank.name}>
                  <div className={classes.rankMenuItem}>
                    <img width="32" src={curRank.icon} alt="" />
                    {curRank.name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className={classes.question}>What is the highest rank you've ever achieved?</div>
          <FormControl variant="filled" className={classes.rankFormControl}>
            <InputLabel id="rank-input-label">RANK</InputLabel>
            <Select
              labelId="rank-input-label"
              value={highestRank}
              onChange={(e) => setHighestRank(e.target.value)}
            >
              {ranks.map((curRank) => (
                <MenuItem value={curRank.name}>
                  <div className={classes.rankMenuItem}>
                    <img width="32" src={curRank.icon} alt="" />
                    {curRank.name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className={classes.question}>What rank do you think you should be?</div>
          <div className={classes.questionInfo}>Use this if you haven't played many ranked games this season, or if you think your rank isn't accurate for any other reason. Otherwise, put the same rank as your current rank.</div>
          <FormControl variant="filled" className={classes.rankFormControl}>
            <InputLabel id="rank-input-label">RANK</InputLabel>
            <Select
              labelId="rank-input-label"
              value={rankShouldBe}
              onChange={(e) => setRankShouldBe(e.target.value)}
            >
              {ranks.map((rank) => (
                <MenuItem value={rank.name}>
                  <div className={classes.rankMenuItem}>
                    <img width="32" src={rank.icon} alt="" />
                    {rank.name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className={classes.question}>How did you hear about FFCS?</div>
          <div className={classes.questionInfo}>If you heard from a friend, please put their name.</div>
          <TextField value={heardFrom} onChange={(e) => setHeardFrom(e.target.value)} variant="filled" color="secondary" label="" inputProps={{ maxLength: 32 }} />

          <Button disabled={loading} className={classes.submitButton} fullWidth type="submit" variant="contained" color="secondary" onClick={submit}>
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

export default connect(mapStateToProps)(RumbleSignup);
