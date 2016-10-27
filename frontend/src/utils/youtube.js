import axios from 'axios';
import { API_KEY } from '../appInfo';
import { startFetch, finishPlayer, finishFetch } from '../reducers/playerReducer';

const fetch = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// API Documentation: https://developers.google.com/youtube/v3/docs/search/list
export async function search(query) {
  let result = [];
  let pageToken;

  for (let searchCount = 0; searchCount < 5; searchCount++) {
    const res = await fetch.get('search', {
      params: {
        // Skip `q` param to get next data with pageToken
        q: searchCount === 0 ? query : null,
        part: 'snippet',
        type: 'video',
        key: API_KEY,
        pageToken,
      },
    }).then(res => res.data);

    if (searchCount === 0 && res.items.length === 0) {
      break;
    }

    result = [...result, ...res.items];

    if (!res.hasOwnProperty('nextPageToken')) {
      break;
    }

    pageToken = res.nextPageToken;
  }

  return result;

  // for (let i = 1; i < searchCount; i++) {
  //   await fetch.get('search', {
  //     params: {
  //       pageToken,
  //       part: 'snippet',
  //       type: 'video',
  //       key: API_KEY,
  //     }
  //   }).then(res => )
  // }
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
