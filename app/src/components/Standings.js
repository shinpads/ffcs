import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getStandings } from '../api';
import Match from './Match';
import TeamName from './TeamName';
import Spinner from './Spinner';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = createUseStyles({
  container: {
    boxShadow: '1px 1px 2px #000 !important',
  },
  standing: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    textAlign: 'center',
    fontSize: '20px',
    padding: '8px 0px',
    borderBottom: '1px solid',
  }
});

const Standings = () => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    async function start() {
      const newStandings = await getStandings(2);
      newStandings.sort((a, b) => a.l - b.l)
      newStandings.sort((a, b) => b.w - a.w)
      setStandings(newStandings);
      setLoading(false);
    }
    start();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0, marginBottom: '1rem' }}>STANDINGS</h1>
      {loading && <Spinner />}
      {!loading && (
        <TableContainer classes={{ root: classes.container }} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Team</TableCell>
                <TableCell align="left">W</TableCell>
                <TableCell align="left">L</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {standings.map(standing => (
                <TableRow key={standing.team.id}>
                  <TableCell component="th" scope="row"><TeamName team={standing.team} /></TableCell>
                  <TableCell component="th" scope="row">{standing.w}</TableCell>
                  <TableCell component="th" scope="row">{standing.l}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <br />
    </div>
  );
};

export default Standings;
