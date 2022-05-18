import axios from 'axios';

export async function getSeason(season, cb) {
  const response = await axios.get('/api/season/', { params: { season } });
  const result = response.data.data || [];
  if (cb) cb(result);

  return result;
}

export async function getAllSeasons() {
  const response = await axios.get('/api/season/', { params: { all: true } });

  return response.data.data;
}

export async function getSeasonByName(name, cb) {
  const response = await axios.get('/api/season/', { params: { season_name: name } });
  const result = response.data.data || [];
  if (cb) cb(result);

  return result;
}

export async function submitVote(season) {
  const response = await axios.post('/api/vote/', { season });

  return response.data;
}

export async function getVote() {
  const response = await axios.get('/api/vote/');

  return response.data.data || false;
}

export async function getMatches() {
  const response = await axios.get('/api/matches/');
  const result = response.data.data || [];

  return result;
}

export async function getMatch(matchId) {
  const response = await axios.get(`/api/match/${matchId}`);

  const result = response.data.data;

  return result;
}

export async function getGameTimeline(gameId) {
  const response = await axios.get(`/api/game/${gameId}/timeline`);

  const result = response.data.data;

  return result;
}

export async function getTeam(id) {
  const response = await axios.get('/api/team/', { params: { id } });

  return response.data.data;
}

export async function getAllCurrentSeasonTeams() {
  const response = await axios.get('/api/team/', { params: { currentSeasonTeams: true } });
  return response.data.data;
}

export async function getUser(userId) {
  const response = await axios.get(`/api/user/${userId}/`);
  const result = response.data.data;

  return result;
}

export async function discordLogin() {
  const response = await axios.get('/oauth2/login/');
}

export async function signup(data) {
  const response = await axios.post('/api/signup/', data);
  return response.data;
}

export async function saveTeamManage(data) {
  const response = await axios.patch('/api/team/', data);
  return response.data;
}

export async function getStandings(season = 3) {
  const response = await axios.get('/api/season/standings/', { params: { season } });
  return response.data.data;
}

export async function getPlayers() {
  const response = await axios.get('/api/players/');
  return response.data.data;
}

export async function getPlayersCurrentSeason() {
  const response = await axios.get('/api/players/current/');
  return response.data.data;
}

export async function postDateProposal(data) {
  const response = await axios.post('/api/match/proposeschedule/', data)
    .catch((error) => ({
      status: error.response.status,
      data: error.response.data,
    }));

  return response;
}
