import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import {
  Button, ClickAwayListener, Grow, MenuList, Paper, Popper,
} from '@material-ui/core';

const styles = createUseStyles({
  dropdownContainer: {
    zIndex: '11',
  },
  dropdown: {
    padding: '8px',
    display: 'flex',
    textAlign: 'center',
  },
});

const HeaderMenu = ({ name, children }) => {
  const classes = styles();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleClick = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <div>
      <Button
        aria-controls={menuAnchor ? 'team-menu' : null}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseOver={handleClick}
      >{name}
      </Button>
      <Popper
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        className={classes.dropdownContainer}
      >
        <Grow>
          <ClickAwayListener onClickAway={handleClose}>
            <Paper className={classes.dropdown}>
              <MenuList id="team-menu" autoFocusItem={!!menuAnchor}>
                {children}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Grow>
      </Popper>
    </div>
  );
};

export default HeaderMenu;
