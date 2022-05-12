const sortIndex = {
  SUPP: 0,
  ADC: 1,
  MID: 2,
  JG: 3,
  TOP: 4,
};

const sortTeamPlayers = (players) => players.sort((a, b) => sortIndex[b.role] - sortIndex[a.role]);

export default sortTeamPlayers;
