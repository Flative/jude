export const actions = {
  PLAYER_INITIALIZED: 'PLAYER_INITIALIZED',
  PLAYER_VIDEO_UPDATED: 'PLAYER_VIDEO_UPDATED',
  PLAYER_PAUSED: 'PLAYER_PAUSED',
  PLAYER_PLAYED: 'PLAYER_PLAYED',
  PLAYER_FINISHED: 'PLAYER_FINISHED',
  PLAYER_FETCHING_STARTED: 'PLAYER_FETCHING_STARTED',
  PLAYER_FETCHING_FINISHED: 'PLAYER_FETCHING_FINISHED',
};

export function updateVideo(id, index) {
  return { type: actions.PLAYER_VIDEO_UPDATED, id, index };
}

export function initializePlayer(instance) {
  return { type: actions.PLAYER_INITIALIZED, instance };
}

export function pausePlayer(instance) {
  instance.pauseVideo();
  return { type: actions.PLAYER_PAUSED };
}

export function playPlayer(instance) {
  instance.playVideo();
  return { type: actions.PLAYER_PLAYED };
}

export function startFetch() {
  return { type: actions.PLAYER_FETCHING_STARTED };
}

export function finishFetch() {
  return { type: actions.PLAYER_FETCHING_FINISHED };
}

export function finishPlayer() {
  return (dispatch, getState) => {
    const { player, playlist } = getState();
    const currentVideoIndex = player.currentVideoIndex;

    dispatch({ type: actions.PLAYER_FINISHED });
    if (currentVideoIndex < playlist.data.length - 1) {
      dispatch(updateVideo(playlist.data[currentVideoIndex + 1].id, currentVideoIndex + 1));
    }
  };
}

export const initialState = {
  instance: null,
  currentVideoId: null,
  currentVideoIndex: null,
  isPaused: true,
  isFetching: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYER_INITIALIZED:
      return { ...state,
        instance: action.instance,
      };
    case actions.PLAYER_VIDEO_UPDATED:
      return { ...state,
        currentVideoId: action.id,
      };
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
    default:
      return state;
  }
};
