import axios from 'axios';
import { API_KEY } from '../appInfo';

const fetch = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// www.googleapis.com/youtube/v3/search?q=beenzino&part=snippet&key=AIzaSyCUEGaOyO0O7Q8Yewd9o47Yg-OkJuQcfRs
export function search(query) {
  return fetch.get('search', {
    params: {
      q: query,
      part: 'snippet',
      key: API_KEY,
    },
  })
    .then(res => res.data);
}
