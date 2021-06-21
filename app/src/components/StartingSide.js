import React from 'react';
import { createUseStyles } from 'react-jss';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import colors from '../colors';


const DarkTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: colors.header,
    color: 'white',
    boxShadow: theme.shadows[1],
  },
}))(Tooltip);

const styles = createUseStyles({
  side: {
    // width: '8px',
    // height: '8px',
    // borderRadius: '12px',
    margin: '0px 4px',
    marginTop: '2px',
    cursor: 'pointer',
  },
  red: {
    // backgroundColor: '#d03125',
    // color: '#d03125',
  },
  blue: {
    // backgroundColor: '#4b9dff',
    color: '#4b9dff',
  }
});

const StartingSide = ({ side }) => {
  const classes = styles();

  if (!side) {
    return null;
  }
  return (
    <DarkTooltip title={`This team starts ${side} side`}>
      <div className={`${classes.side} ${side === 'blue' ? classes.blue : classes.red}`}>
        {side === 'blue' ? '[B]': ''}
      </div>
    </DarkTooltip>
  );
};

export default StartingSide;
