import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';
import { createUseStyles } from 'react-jss';
import Role from './Role';

const styles = createUseStyles({
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
});

const ROLES = [
  { role: 'top', id: 1 },
  { role: 'jungle', id: 2 },
  { role: 'mid', id: 3 },
  { role: 'bot', id: 4 },
  { role: 'support', id: 5 },
];

const RolePreferenceSelector = ({ rolePreferences, changeRolePrefs }) => {
  const classes = styles();

  if (!rolePreferences) {
    return <div />;
  }

  return (
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
  );
};

export default RolePreferenceSelector;
