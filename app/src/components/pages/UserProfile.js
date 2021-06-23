import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import Teams from './Teams';
import Matches from '../Matches';
import Header from '../Header';
import Role from '../Role';
import colors from '../../colors';
import { getMatch } from '../../api';
import Spinner from '../Spinner';
import Participant from '../League/Participant';
import TeamName from '../TeamName';
import ChampionIcon from '../League/ChampionIcon';


const styles = createUseStyles({
  title: {
    fontSize: '24px',
    textAlign: 'center',
    textTransform: 'uppercase',
    display: 'flex',
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
});

const ROLES = [
  { role: 'top', id: 1 },
  { role: 'jungle', id: 2 },
  { role: 'mid', id: 3 },
  { role: 'bot', id: 4 },
  { role: 'support', id: 5 }
]

const UserProfile = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const { id } = props.match.params;

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
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.title}>
          Player
        </div>

      </div>
    </>
  );
};

export default UserProfile;
