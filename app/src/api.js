import axios from 'axios';

export async function getSeason(season, cb) {
  const response = await axios.get('/api/season/', { params: { season } });
  const result = response.data.data || [];
  if (cb) cb(result);

  return result;
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
