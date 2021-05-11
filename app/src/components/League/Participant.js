import React from 'react';
import { createUseStyles } from 'react-jss';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ChampionIcon from './ChampionIcon';
import Chip from '@material-ui/core/Chip';
import colors from '../../colors';

const MVPChip = withStyles((theme) => ({
  root: {
    fontSize: '10px',
    backgroundColor: colors.mvp,
    height: '24px',
  },
}))(Chip);

const styles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  summonerName: {
    margin: '0px 8px',
  }
});

const Participant = ({ participant, player, mvp, reverse }) => {
  const classes = styles();

  return (
    <div className={classes.root} style={reverse ? { flexDirection: 'row-reverse' } : {}}>
      <ChampionIcon championId={participant.championId} />
      <div className={classes.summonerName}>{player.summonerName}</div>
      {mvp && <MVPChip label="MVP" />}
    </div>
  );
}

export default Participant;
