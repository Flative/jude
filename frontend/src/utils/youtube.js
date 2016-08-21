import axios from 'axios';
import { API_KEY } from '../appInfo';

const fetch = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// API Documentation: https://developers.google.com/youtube/v3/docs/search/list
export function search(query) {
  return fetch.get('search', {
    params: {
      q: query,
      part: 'snippet',
      type: 'video',
      key: API_KEY,
    },
  })
    .then(res => res.data);
}

export function youtubeTimeWatcher(player, cb) {
  const { ENDED, PLAYING, PAUSED, BUFFERING, CUED } = YT.PlayerState;
  const duration = player.getDuration;

  let currentTime = 0;
  let timerHandler;
  const startTimer = () => timerHandler = setInterval(() => {
    currentTime += 1 / 60;
  }, 1000 / 60);
  const stopTimer = () => clearTimeout(timerHandler);

  player.addEventListener('onStateChange', (e) => {
    switch(e.data) {
      case PLAYING:
        console.log('PLAYING');
        if (timerHandler) {
          stopTimer();
        }
        startTimer();
        break;
      case ENDED:
        console.log('ENDED');
        break;
      case PAUSED:
        console.log('PAUSED:', player.getCurrentTime(), currentTime);
        stopTimer();
        break;
      case BUFFERING:
        console.log('BUFFERING');
        break;
      case CUED:
        console.log('CUED');
        break;
      default: break;
    }
  });
}
