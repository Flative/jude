export const PLAYER_INITIALIZED = 'PLAYER_INITIALIZED';
export const PLAYER_PAUSED = 'PLAYER_PAUSED';
export const PLAYER_PLAYED = 'PLAYER_PLAYED';
export const PLAYER_FETCHING_STARTED = 'PLAYER_FETCHING_STARTED';
export const PLAYER_FETCHING_FINISHED = 'PLAYER_FETCHING_FINISHED';

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
