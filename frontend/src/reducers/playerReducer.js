import { updateActiveSong, getNextSong, updateUpdatingFlag } from './playlistReducer'

export const actions = {
  PLAYER_REGISTERED: 'PLAYER_REGISTERED',
  PLAYER_VIDEO_UPDATED: 'PLAYER_VIDEO_UPDATED',
  PLAYER_PAUSED: 'PLAYER_PAUSED',
  PLAYER_PLAYED: 'PLAYER_PLAYED',
  PLAYER_FINISHED: 'PLAYER_FINISHED',
  PLAYER_REGISTER_PROGRESSBAR: 'PLAYER_REGISTER_PROGRESSBAR',
  PLAYER_FETCHING_STARTED: 'PLAYER_FETCHING_STARTED',
  PLAYER_FETCHING_FINISHED: 'PLAYER_FETCHING_FINISHED',
  PLAYER_PROGRESSBAR_PERCENTAGE_UPDATED: 'PLAYER_PROGRESSBAR_PERCENTAGE_UPDATED',
  PLAYER_YOUTUBE_STATE_UPDATED: 'PLAYER_YOUTUBE_STATE_UPDATED',
  PLAYER_VOLUME_UPDATED: 'PLAYER_VOLUME_UPDATED',
  PLAYER_STATE_REPLACED: 'PLAYER_STATE_REPLACED',
}

export const YOUTUBE_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
}

// Store player instance to redux state tree when initializing
export function registerPlayer(youtubePlayer) {
  youtubePlayer.setVolume(50)

  return (dispatch) => {
    if (youtubePlayer.addEventListener) {
      const { ENDED, PLAYING, PAUSED, BUFFERING, CUED } = YOUTUBE_STATE

      let hasBufferingStarted = false
      let prevTime = -1
      let currentTime = 0

      const updateTime = () => {
        prevTime = currentTime
        currentTime = youtubePlayer.getCurrentTime()
        if (Math.abs(prevTime - currentTime) > 0) {
          const duration = youtubePlayer.getDuration()
          dispatch(updateProgressBarPercentage((currentTime / duration) * 100))
        }
      }

      const timer = {
        handler: null,
        start: () => { timer.handler = setInterval(() => updateTime(), 400) },
        stop: () => clearTimeout(timer.handler),
      }

      youtubePlayer.addEventListener('onStateChange', (e) => {
        dispatch(updateYoutubePlayerState(e.data))
        switch (e.data) {
          case PLAYING:
            timer.stop()
            timer.start()
            if (hasBufferingStarted) {
              hasBufferingStarted = false
            }
            break
          case BUFFERING:
            hasBufferingStarted = true
            break
          case PAUSED:
            timer.stop()
            updateTime()
            break
          case ENDED:
            dispatch(finishSong())
            break
          case CUED:
          default:
            break
        }
      })
    }
    dispatch({ type: actions.PLAYER_REGISTERED, youtubePlayer })
  }
}

export function registerProgressBar(updatePercentage) {
  return { type: actions.PLAYER_REGISTER_PROGRESSBAR, updatePercentage }
}

export function updateProgressBarPercentage(progressBarPercentage) {
  return { type: actions.PLAYER_PROGRESSBAR_PERCENTAGE_UPDATED, progressBarPercentage }
}

export function pauseSong() {
  return { type: actions.PLAYER_PAUSED }
}

export function playSong() {
  return { type: actions.PLAYER_PLAYED }
}

// Fetching (buffering)
export function startFetch() {
  return { type: actions.PLAYER_FETCHING_STARTED }
}

export function finishFetch() {
  return { type: actions.PLAYER_FETCHING_FINISHED }
}

export function replacePlayerState(payload) {
  return { type: actions.PLAYER_STATE_REPLACED, ...payload }
}

export function updateYoutubePlayerState(youtubePlayerState) {
  return (dispatch) => {
    if (youtubePlayerState === YOUTUBE_STATE.PLAYING || youtubePlayerState === YOUTUBE_STATE.CUED) {
      dispatch(updateUpdatingFlag()) // let playlist know activeItem has changed successfully
    }
    dispatch({ type: actions.PLAYER_YOUTUBE_STATE_UPDATED, youtubePlayerState })
  }
}

// Play next song and update playlist when the song finished
export function finishSong() {
  return (dispatch, getState) => {
    const { playlist } = getState()
    dispatch({ type: actions.PLAYER_FINISHED })
    dispatch(updateActiveSong(getNextSong(playlist)))
  }
}

export function setVolume(volume) {
  return { type: actions.PLAYER_VOLUME_UPDATED, volume }
}

export const initialState = {
  youtubePlayer: null,
  progressBarPercentage: 0,
  updatePercentage: null,
  youtubePlayerState: null,
  isPaused: false,
  isFinished: false,
  volume: 50,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYER_REGISTERED:
      return { ...state,
        youtubePlayer: action.youtubePlayer,
      }
    case actions.PLAYER_FINISHED:
      return { ...state,
        currentVideoId: null,
        isFinished: true,
        updatePercentage: 99.9,
      }
    case actions.PLAYER_PLAYED:
      return { ...state,
        isPaused: false,
        isFinished: false,
      }
    case actions.PLAYER_PAUSED:
      return { ...state,
        isPaused: true,
      }
    case actions.PLAYER_REGISTER_PROGRESSBAR:
      return { ...state,
        updatePercentage: action.updatePercentage,
      }
    case actions.PLAYER_PROGRESSBAR_PERCENTAGE_UPDATED:
      return { ...state,
        progressBarPercentage: action.progressBarPercentage,
      }
    case actions.PLAYER_YOUTUBE_STATE_UPDATED:
      return { ...state,
        youtubePlayerState: action.youtubePlayerState,
        isFinished: action.youtubePlayerState === YOUTUBE_STATE.ENDED,
      }
    case actions.PLAYER_STATE_REPLACED:
      return { ...state,
        isFinished: action.isFinished,
        isPaused: action.isPaused,
        youtubePlayerState: action.youtubePlayerState,
        progressBarPercentage: action.progressBarPercentage || 0,
        volume: action.volume,
      }
    case actions.PLAYER_VOLUME_UPDATED:
      return { ...state,
        volume: action.volume,
      }
    default:
      return state
  }
}
