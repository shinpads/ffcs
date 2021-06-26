import React from 'react';
import { createUseStyles } from 'react-jss';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ChampionIcon from './ChampionIcon';
import ChampionName from './ChampionName';
import SummonerSpellIcon from './SummonerSpellIcon';
import PerkIcon from './PerkIcon';
import PerkStyleIcon from './PerkStyleIcon';
import Chip from '@material-ui/core/Chip';
import Item from './Item';
import colors from '../../colors';
import UserName from '../UserName';

export const MVPChip = withStyles((theme) => ({
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
  individualParticipant: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  summonerName: {
    margin: '0px 8px',
  },
  itemsContainer: {
    marginTop: '4px',
    display: 'flex',
  },
  individualItemsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridGap: '4px',
  },
  summonerSpellContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  championContainer: {
    display: 'flex',
  },
  killsDeathsAssists: {
    fontWeight: 600,
    color: colors.secondary,
  },
  kdaContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const ITEM_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
const ITEM_NUMBERS_STACKED = [0, 1, 2, 6, 3, 4, 5];

export const Participant = ({ participant, player, mvp, reverse, isSub, user }) => {
  const classes = styles();

  return (
    <div>
      <div className={classes.root} style={reverse ? { flexDirection: 'row-reverse' } : {}}>
        <ChampionIcon championId={participant.championId} width={32} />
        <div className={classes.summonerSpellContainer}>
          <SummonerSpellIcon spellId={participant.spell1Id} />
          <SummonerSpellIcon spellId={participant.spell2Id} />
        </div>
        <div className={classes.summonerSpellContainer}>
          <PerkIcon width={16} perkId={participant.stats.perk0} />
          <PerkStyleIcon width={16} perkStyleId={participant.stats.perkSubStyle} />
        </div>
        {user
          ? (<UserName user={user} nameClass={classes.summonerName} />)
          : (<div className={classes.summonerName}>{player.summonerName}</div>)
        }
        {mvp && <MVPChip label="MVP" />}
        {isSub && <SubChip label="SUB" />}
      </div>
      <div className={classes.itemsContainer} style={reverse ? { flexDirection: 'row-reverse' } : {}}>
        {ITEM_NUMBERS.map(itemNum => {
          const key = `item${itemNum}`;
            return (
              <Item key={itemNum} itemId={participant.stats[key]} />
            )
        })}
      </div>
    </div>
  );
}

export const IndividualParticipant = ({ participant, player, mvp, reverse, isSub, user }) => {
  const classes = styles();
  const { kills, deaths, assists } = participant.stats;
  const kda = ((kills + assists) / (deaths || 0)).toFixed(2);

  return (
    <div className={classes.individualParticipant}>
      <div className={classes.championContainer}>
        <div>
          <ChampionIcon championId={participant.championId} width={48} />
        </div>
        <div className={classes.summonerSpellContainer}>
          <SummonerSpellIcon width={24} spellId={participant.spell1Id} />
          <SummonerSpellIcon width={24} spellId={participant.spell2Id} />
        </div>
        <div className={classes.summonerSpellContainer}>
          <PerkIcon width={24} perkId={participant.stats.perk0} />
          <PerkStyleIcon width={24} perkStyleId={participant.stats.perkSubStyle} />
        </div>
      </div>
      <div className={classes.kdaContainer}>
        <div className={classes.killsDeathsAssists}>{kills} / {deaths} / {assists}</div>
        <div>{kda} KDA</div>
      </div>
      <div className={classes.individualItemsContainer}>
        {ITEM_NUMBERS_STACKED.map(itemNum => {
          const key = `item${itemNum}`;
            return (
              <Item key={itemNum} itemId={participant.stats[key]} />
            )
        })}
      </div>
    </div>
  )
}
