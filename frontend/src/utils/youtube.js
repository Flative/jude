import axios from 'axios';
import { API_KEY } from '../appInfo';
import { startFetch, finishPlayer, finishFetch } from '../actions/playerAction';

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

  let prevTime = -1;
  let currentTime = 0;
  const updateTime = () => {
    prevTime = currentTime;
    currentTime = Math.floor(player.getCurrentTime());
    if (Math.abs(prevTime - currentTime) > 0) {
      cb(currentTime);
    }
  };
  const timer = {
    handler: null,
    start: () => timer.handler = setInterval(() => updateTime(), 100),
    stop: () => clearTimeout(timer.handler),
  };

  player.addEventListener('onStateChange', (e) => {
    switch(e.data) {
      case PLAYING:
        console.log('PLAYING');
        timer.stop();
        timer.start();
        break;
      case ENDED:
        console.log('ENDED');
        break;
      case PAUSED:
        timer.stop();
        updateTime();
        console.log('PAUSED:', player.getCurrentTime(), currentTime);
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

export function youtubeStateWatcher(player, dispatch) {
  const { ENDED, PLAYING, PAUSED, BUFFERING, CUED } = YT.PlayerState;
  let isBufferingStarted = false;

  player.addEventListener('onStateChange', (e) => {
    switch(e.data) {
      case BUFFERING:
        isBufferingStarted = true;
        dispatch(startFetch());
        break;
      case PLAYING:
      case PAUSED:
        if (isBufferingStarted) {
          dispatch(finishFetch());
          isBufferingStarted = false;
        }
        break;
      case ENDED:
        dispatch(finishPlayer());
      case CUED:
      default:
        break;
    }
  });
}
