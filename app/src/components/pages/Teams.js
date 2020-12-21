import React from 'react';
import { createUseStyles } from 'react-jss';
import Team from '../Team';

const styles = createUseStyles({
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
});

const teams = [
  {
    name: 'Tesla Giga Horse',
    players: [
      {
        name: 'Quan Jovi',
        role: 'top',
      },
      {
        name: 'DamonteFanboi',
        role: 'jungle',
      },
      {
        name: 'DaTranboi',
        role: 'middle',
      },
      {
        name: 'Fenryn',
        role: 'bottom',
      },
      {
        name: 'shinpads',
        role: 'support',
      },
    ],
  },
  {
    name: 'Team 2',
    players: [
      {
        name: 'marshmelllo',
        role: 'top',
      },
      {
        name: 'piggy',
        role: 'jungle',
      },
      {
        name: 'shinpads',
        role: 'middle',
      },
      {
        name: 'doublelift',
        role: 'bottom',
      },
      {
        name: 'corejj',
        role: 'support',
      },
    ],
  },
];

const Teams = () => {
  const classes = styles();
  return (
    <div className={classes.container}>
      {teams.map(team => <Team team={team} />)}
    </div>
  );
};

export default Teams;
