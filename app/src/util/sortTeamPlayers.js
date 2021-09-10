const sortIndex = {
  SUPP: 0,
  ADC: 1,
  MID: 2,
  JG: 3,
  TOP: 4,
};

function sortTeamPlayers(players) {
  players = players.sort((a, b) => sortIndex[b.role] - sortIndex[a.role]);

  return players;
}

export default sortTeamPlayers
