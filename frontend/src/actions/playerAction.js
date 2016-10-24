export const PLAYER_INITIALIZED = 'PLAYER_INITIALIZED';
export const PLAYER_VIDEO_UPDATED = 'PLAYER_VIDEO_UPDATED';
export const PLAYER_PAUSED = 'PLAYER_PAUSED';
export const PLAYER_PLAYED = 'PLAYER_PLAYED';
export const PLAYER_FINISHED = 'PLAYER_FINISHED';
export const PLAYER_FETCHING_STARTED = 'PLAYER_FETCHING_STARTED';
export const PLAYER_FETCHING_FINISHED = 'PLAYER_FETCHING_FINISHED';

export function updateVideo(id, index) {
  return { type: PLAYER_VIDEO_UPDATED, id, index };
}

export function initializePlayer(instance) {
  return { type: PLAYER_INITIALIZED, instance };
}

export function pausePlayer(instance) {
  instance.pauseVideo();
  return { type: PLAYER_PAUSED };
}

export function playPlayer(instance) {
  instance.playVideo();
  return { type: PLAYER_PLAYED };
}

export function startFetch() {
  return { type: PLAYER_FETCHING_STARTED };
}

export function finishFetch() {
  return { type: PLAYER_FETCHING_FINISHED };
}

export function finishPlayer() {
  return (dispatch, getState) => {
    const { player, playlist } = getState();
    const currentVideoIndex = player.currentVideoIndex;

    dispatch({ type: PLAYER_FINISHED });
    if (currentVideoIndex < playlist.data.length - 1) {
      dispatch(updateVideo(playlist.data[currentVideoIndex + 1].id, currentVideoIndex + 1));
    }
  };
}
