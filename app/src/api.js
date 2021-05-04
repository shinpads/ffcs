import axios from 'axios';

export async function getSeason(season, cb) {
  const response = await axios.get('/api/season/', { params: { season } });
  const result = response.data.data || [];
  if (cb) cb(result);

  return result;
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
  const response  = await axios.get('/api/vote/');

  return response.data.data || false;
}

export async function getMatches() {
  const response = await axios.get('/api/matches/');
  const result = response.data.data || [];

  return result;
}

export async function getTeam() {
  throw new Error('not done');
}

export async function discordLogin() {
  const response = await axios.get('/oauth2/login/');
}

export async function signup(data) {
  const response = await axios.post('/api/signup/', data);
  return response.data;
}

export async function getStandings(season=2) {
  const response = await axios.get('/api/season/standings/', { params: { season } });
  return response.data.data;
}
