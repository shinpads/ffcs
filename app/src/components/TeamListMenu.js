import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import {
  Button, ClickAwayListener, Grow, MenuList, Paper, Popper,
} from '@material-ui/core';
import { getAllCurrentSeasonTeams } from '../api';

const styles = createUseStyles({
  container: {

  },
  dropdown: {
    padding: '8px',
    display: 'flex',
    textAlign: 'center',
  },
  teamText: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
});

const TeamListMenu = () => {
  const classes = styles();
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [teams, setTeams] = useState(null);

  const handleClick = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

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
    <div className={classes.container}>
      <Button
        aria-controls={menuAnchor ? 'team-menu' : null}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseOver={handleClick}
      >Teams
      </Button>
      <Popper
        anchorEl={menuAnchor}
        open={!!menuAnchor}
      >
        <Grow>
          <ClickAwayListener onClickAway={handleClose}>
            <Paper className={classes.dropdown}>
              <MenuList id="team-menu" autoFocusItem={!!menuAnchor}>
                {teams.map(team => (
                  <a href={`/team/${team.id}`}>
                    <div id={team.id} className={classes.teamText}>{team.name}</div>
                  </a>
                ))}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Grow>
      </Popper>
    </div>
  );
};

export default TeamListMenu;
