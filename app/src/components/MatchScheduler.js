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
  modalContentContainer: {
    width: '500px',
    height: '150px',
    boxShadow: '5px 5px 5px #000 !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  submitButton: {
    paddingLeft: '16px',
  },
  datetimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '12px',
  },
  failResponseText: {
    color: '#FF9494',
  },
  successResponseText: {
    color: '#58D68D',
  },
});

const MatchScheduler = ({ sendingTeam, match }) => {
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();
  const classes = styles({ responseCode: response?.status });

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
      sendingTeamId: sendingTeam?.id,
      matchId: match.id,
    };
    const res = await postDateProposal(data);
    setResponse(res);
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
        <Paper className={classes.modalContentContainer}>
          <div>Select proposed date (in EST) for {match?.teams[0].name} vs {match?.teams[1].name}, week {match?.week}</div>
          <div className={classes.datetimeContainer}>
            <div>
              <TextField disabled={loading} type="datetime-local" onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className={classes.submitButton}>
              <Button disabled={loading || !date} variant="contained" onClick={submitDatetime}>Submit</Button>
            </div>
          </div>
          <div className={response?.status === 200 ? classes.successResponseText : classes.failResponseText}>{response?.data.message}</div>
        </Paper>
      </Modal>
    </div>
  );
};

export default MatchScheduler;
