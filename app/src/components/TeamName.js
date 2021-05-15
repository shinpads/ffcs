import React from 'react';
import { createUseStyles } from 'react-jss';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Player from './Player';
import colors from '../colors';

const DarkTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: colors.header,
    color: 'rgba(0, 0, 0, 1)',
    boxShadow: theme.shadows[1],
  },
}))(Tooltip);

const sortIndex = {
  SUPP: 0,
  ADC: 1,
  MID: 2,
  JG: 3,
  TOP: 4,
};

const styles = createUseStyles({
  name: {
    cursor: 'pointer',
  },
  tooltip: {
    width: '100%',
    height: '100%',
  }
});

const TeamName = ({ team, nameClass }) => {
  const classes = styles();
  team.players.sort((a, b) => sortIndex[b.role] - sortIndex[a.role]);
  return (
    <DarkTooltip title={
      <div className={classes.tooltip}>
        {team.players.map((player, index) => <Player player={player} />)}
      </div>
    }>
      <div className={`${classes.name} ${nameClass}`}>
        {team.name}
      </div>
    </DarkTooltip>
  );
};

export default TeamName;
