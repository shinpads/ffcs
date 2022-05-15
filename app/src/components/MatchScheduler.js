import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import {
  Button, ClickAwayListener, Grow, Modal, Paper, Popper, TextField,
} from '@material-ui/core';
import { postDateProposal } from '../api';

const styles = createUseStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  datetimeContainer: {
    width: '400px',
    height: '150px',
    boxShadow: '5px 5px 5px #000 !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    paddingLeft: '16px',
  },
});

const MatchScheduler = () => {
  const classes = styles();
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitDatetime = async () => {
    setLoading(true);
    const data = {
      date: Date.parse(date),

    };
    const res = await postDateProposal();
    setLoading(false);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="outlined"
        style={{ fontSize: '12px', float: 'right' }}
      >Propose Date
      </Button>
      <Modal className={classes.modal} open={open} onClose={handleClose}>
        <Paper className={classes.datetimeContainer}>
          <div>
            <TextField disabled={loading} type="datetime-local" onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className={classes.submitButton}>
            <Button disabled={loading} variant="contained" onClick={submitDatetime}>Submit</Button>
          </div>
        </Paper>
      </Modal>
    </div>
  );
};

export default MatchScheduler;
