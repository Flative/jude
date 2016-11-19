import { updateActiveItemInPlaylist } from './playlistReducer';
import { youtubeTimeWatcher } from '../utils/youtube';
import { sleep } from '../utils/util';

export const actions = {
  PLAYER_INITIALIZED: 'PLAYER_INITIALIZED',
  PLAYER_VIDEO_UPDATED: 'PLAYER_VIDEO_UPDATED',
  PLAYER_PAUSED: 'PLAYER_PAUSED',
  PLAYER_PLAYED: 'PLAYER_PLAYED',
  PLAYER_FINISHED: 'PLAYER_FINISHED',
  PLAYER_REGISTER_PROGRESSBAR: 'PLAYER_REGISTER_PROGRESSBAR',
  PLAYER_FETCHING_STARTED: 'PLAYER_FETCHING_STARTED',
  PLAYER_FETCHING_FINISHED: 'PLAYER_FETCHING_FINISHED',
  PLAYER_UPDATE_PROGRESSBAR_PERCENTAGE: 'PLAYER_UPDATE_PROGRESSBAR_PERCENTAGE',
};

// Store player instance to redux state tree when initializing
export function registerPlayer(youtubePlayer) {
  return (dispatch, getState) => {
    const { ENDED, PLAYING, PAUSED, BUFFERING, CUED } = YT.PlayerState;
    const { player } = getState();
    const onPercentageChange = player.onPercentageChange;

    let isBufferingStarted = false;
    let prevTime = -1;
    let currentTime = 0;

    const updateTime = () => {
      prevTime = currentTime;
      currentTime = Math.floor(youtubePlayer.getCurrentTime());
      if (Math.abs(prevTime - currentTime) > 0) {
        const duration = youtubePlayer.getDuration();
        onPercentageChange((currentTime / duration) * 100);
        // dispatch(updateProgressBarPercentage((currentTime / duration) * 100));
      }
    };

    const timer = {
      handler: null,
      start: () => timer.handler = setInterval(() => updateTime(), 100),
      stop: () => clearTimeout(timer.handler),
    };

    youtubePlayer.addEventListener('onStateChange', (e) => {
      switch(e.data) {
        case PLAYING:
          console.log('PLAYING');
          timer.stop();
          timer.start();
          dispatch(playPlayer());
          break;

        case BUFFERING:
          isBufferingStarted = true;
          dispatch(startFetch());
          break;

        case PAUSED:
          timer.stop();
          updateTime();
          console.log('PAUSED:', youtubePlayer.getCurrentTime(), currentTime);
          if (isBufferingStarted) {
            dispatch(finishFetch());
            isBufferingStarted = false;
          }
          break;

        case ENDED:
          console.log('ENDED');
          dispatch(finishPlayer());
          break;

        case CUED:
          youtubePlayer.playVideo();
          console.log('CUED');
          break;

        default:
          break;
      }
    });

    dispatch({ type: actions.PLAYER_INITIALIZED, youtubePlayer });
  };
}

export function registerProgressBar(onPercentageChange) {
  return { type: actions.PLAYER_REGISTER_PROGRESSBAR, onPercentageChange };
}

export function pausePlayer() {
  return (dispatch, getState) => {
    getState().player.youtubePlayer.pauseVideo();
    dispatch({ type: actions.PLAYER_PAUSED });
  };
}

export function playPlayer(isNewVideo) {
  return (dispatch, getState) => {
    dispatch({ type: actions.PLAYER_PLAYED });
  };
}

// Play new song
export function updatePlayerVideo(id, index) {
  return (dispatch, getState) => {
    // dispatch(playPlayer(true));
  };
}

// Fetching (buffering)
export function startFetch() {
  return { type: actions.PLAYER_FETCHING_STARTED };
}

export function finishFetch() {
  return { type: actions.PLAYER_FETCHING_FINISHED };
}

// Play next song and update playlist when the song finished
export function finishPlayer() {
  return (dispatch, getState) => {
    const { player, playlist } = getState();
    const { youtubePlayer, onPercentageChange } = player;
    const { items, activeItem } = playlist;

    onPercentageChange(99.9);
    dispatch({ type: actions.PLAYER_FINISHED });

    if (playlist.doesNextItemExist) {
      sleep(200).then(() => {
        const nextItem = items[activeItem.index + 1];
        dispatch(updateActiveItemInPlaylist(nextItem));

        if (nextItem.id === activeItem.id) {
          youtubePlayer.seekTo(0);
          youtubePlayer.playVideo();
          dispatch(playPlayer());
        }
      });
    }
  };
}

export const initialState = {
  youtubePlayer: null,
  onPercentageChange: null,
  isPaused: true,
  isFetching: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYER_INITIALIZED:
      return { ...state,
        youtubePlayer: action.youtubePlayer,
      };
    // case actions.PLAYER_VIDEO_UPDATED:
    //   return { ...state,
    //     currentVideoId: action.id,
    //   };
    case actions.PLAYER_FINISHED:
      return { ...state,
        currentVideoId: null,
        isPaused: true,
      };
    case actions.PLAYER_PLAYED:
      return { ...state,
        isPaused: false,
      };
    case actions.PLAYER_PAUSED:
      return { ...state,
        isPaused: true,
      };
    case actions.PLAYER_FETCHING_STARTED:
      return { ...state,
        isFetching: true,
      };
    case actions.PLAYER_FETCHING_FINISHED:
      return { ...state,
        isFetching: false,
      };
    case actions.PLAYER_REGISTER_PROGRESSBAR:
      return { ...state,
        onPercentageChange: action.onPercentageChange,
      };
    default:
      return state;
  }
};
