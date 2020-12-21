import axios from 'axios';

export async function getSeason(season, cb) {
  const response = await axios.get('/api/season/', { params: { season } });
  const result = response.data.data || [];
  if (cb) cb(result);

  return result;
}

export async function getTeam() {
  throw new Error('not done');
}
