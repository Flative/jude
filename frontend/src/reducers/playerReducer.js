import { updateActiveItemInPlaylist } from './playlistReducer';
import { youtubeTimeWatcher } from '../utils/youtube';

export const actions = {
  PLAYER_INITIALIZED: 'PLAYER_INITIALIZED',
  PLAYER_VIDEO_UPDATED: 'PLAYER_VIDEO_UPDATED',
  PLAYER_PAUSED: 'PLAYER_PAUSED',
  PLAYER_PLAYED: 'PLAYER_PLAYED',
  PLAYER_FINISHED: 'PLAYER_FINISHED',
  PLAYER_FETCHING_STARTED: 'PLAYER_FETCHING_STARTED',
  PLAYER_FETCHING_FINISHED: 'PLAYER_FETCHING_FINISHED',
  PLAYER_UPDATE_PROGRESSBAR_PERCENTAGE: 'PLAYER_UPDATE_PROGRESSBAR_PERCENTAGE',
};

// Store player instance to redux state tree when initializing
export function registerPlayer(youtubePlayer) {
  return (dispatch, getState) => {
    const { ENDED, PAUSED, BUFFERING } = YT.PlayerState;
    let isBufferingStarted = false;

    youtubeTimeWatcher(youtubePlayer, (sec) => {
      const duration = youtubePlayer.getDuration();
      dispatch(updateProgressBarPercentage((sec / duration) * 100));
    });

    youtubePlayer.addEventListener('onStateChange', (e) => {
      switch(e.data) {
        case BUFFERING:
          isBufferingStarted = true;
          dispatch(startFetch());
          break;
        case PAUSED:
          if (isBufferingStarted) {
            dispatch(finishFetch());
            isBufferingStarted = false;
          }
          break;
        case ENDED:
          dispatch(finishPlayer());
          break;
        default:
          break;
      }
    });

    dispatch({ type: actions.PLAYER_INITIALIZED, youtubePlayer });
  };
}

export function pausePlayer() {
  return (dispatch, getState) => {
    getState().player.youtubePlayer.pauseVideo();
    dispatch({ type: actions.PLAYER_PAUSED });
  };
}

export function playPlayer(isNewVideo) {
  return (dispatch, getState) => {
    const youtubePlayer = getState().player.youtubePlayer;

    dispatch({ type: actions.PLAYER_PLAYED });
  };
}

// Play new song
export function updatePlayerVideo(id, index) {
  return (dispatch, getState) => {
    dispatch({ type: actions.PLAYER_VIDEO_UPDATED, id, index });
    dispatch(playPlayer(true));
  };
}

export function updateProgressBarPercentage(progressBarPercentage) {
  return {
    type: actions.PLAYER_UPDATE_PROGRESSBAR_PERCENTAGE,
    progressBarPercentage,
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
    const currentVideoIndex = player.currentVideoIndex;

    dispatch({ type: actions.PLAYER_FINISHED });
    if (currentVideoIndex < playlist.items.length - 1) {
      dispatch(updatePlayerVideo(playlist.items[currentVideoIndex + 1].id, currentVideoIndex + 1));
      dispatch(updateActiveItemInPlaylist(playlist.items[currentVideoIndex + 1].uuid));
    }
  };
}

export const initialState = {
  youtubePlayer: null,
  progressBarPercentage: 0,
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
    case actions.PLAYER_UPDATE_PROGRESSBAR_PERCENTAGE:
      return { ...state,
        progressBarPercentage: action.progressBarPercentage,
      };
    default:
      return state;
  }
};
