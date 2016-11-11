import { updateActiveItemInPlaylist } from './playlistReducer';

export const actions = {
  PLAYER_INITIALIZED: 'PLAYER_INITIALIZED',
  PLAYER_PAUSED: 'PLAYER_PAUSED',
  PLAYER_PLAYED: 'PLAYER_PLAYED',
  PLAYER_FINISHED: 'PLAYER_FINISHED',
  PLAYER_FETCHING_STARTED: 'PLAYER_FETCHING_STARTED',
  PLAYER_FETCHING_FINISHED: 'PLAYER_FETCHING_FINISHED',
};

// Store player instance to redux state tree when initializing
export function registerPlayer(instance) {
  return { type: actions.PLAYER_INITIALIZED, instance };
}

export function pausePlayer() {
  return (dispatch, getState) => {
    getState().player.instance.pauseVideo();
    dispatch({ type: actions.PLAYER_PAUSED });
  };
}

export function playPlayer() {
  return (dispatch, getState) => {
    getState().player.instance.playVideo();
    dispatch({ type: actions.PLAYER_PLAYED });
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

    dispatch({ type: actions.PLAYER_FINISHED });
  };
}

export const initialState = {
  instance: null,
  isPaused: true,
  isFetching: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYER_INITIALIZED:
      return { ...state,
        instance: action.instance,
      };
    case actions.PLAYER_FINISHED:
      return { ...state,
        isPaused: true,
        instance: null,
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
    default:
      return state;
  }
};
