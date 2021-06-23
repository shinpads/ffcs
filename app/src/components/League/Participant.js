import React from 'react';
import { createUseStyles } from 'react-jss';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ChampionIcon from './ChampionIcon';
import Chip from '@material-ui/core/Chip';
import Item from './Item';
import colors from '../../colors';

const MVPChip = withStyles((theme) => ({
  root: {
    fontSize: '10px',
    backgroundColor: colors.mvp,
    height: '24px',
  },
}))(Chip);

const SubChip = withStyles((theme) => ({
  root: {
    fontSize: '10px',
    backgroundColor: colors.offwhite,
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
  },
  itemsContainer: {
    marginTop: '4px',
  }
});

const Participant = ({ participant, player, mvp, reverse, isSub }) => {
  const classes = styles();

  return (
    <div>
      <div className={classes.root} style={reverse ? { flexDirection: 'row-reverse' } : {}}>
        <ChampionIcon championId={participant.championId} />
        <div className={classes.summonerName}>{player.summonerName}</div>
        {mvp && <MVPChip label="MVP" />}
        {isSub && <SubChip label="SUB" />}
      </div>
      <div className={classes.itemsContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map(itemNum => {
          const key = `item${itemNum}`;
            return (
              <Item key={itemNum} itemId={participant.stats[key]} />
            )
        })}
      </div>
    </div>
  );
}

export default Participant;
