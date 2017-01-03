import { updateActiveSong, getNextSong, updateUpdatingFlag } from './playlistReducer'
import { sleep } from '../utils/util'

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
  PLAYER_YOUTUBE_STATE_UPDATED: 'PLAYER_YOUTUBE_STATE_UPDATED',
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
  window.player = youtubePlayer
  return (dispatch, getState) => {
    const { ENDED, PLAYING, PAUSED, BUFFERING, CUED } = YOUTUBE_STATE
    const { player } = getState()
    const updatePercentage = player.updatePercentage

    let isBufferingStarted = false
    let prevTime = -1
    let currentTime = 0

    const updateTime = () => {
      prevTime = currentTime
      currentTime = youtubePlayer.getCurrentTime()
      if (Math.abs(prevTime - currentTime) > 0) {
        const duration = youtubePlayer.getDuration()
        updatePercentage((currentTime / duration) * 100)
      }
    }

    const timer = {
      handler: null,
      start: () => { timer.handler = setInterval(() => updateTime(), 200) }, // FIXME
      stop: () => clearTimeout(timer.handler),
    }

    youtubePlayer.addEventListener('onStateChange', (e) => {
      dispatch(updateYoutubePlayerState(e.data))
      switch (e.data) {
        case PLAYING:
          console.log('PLAYING')
          timer.stop()
          timer.start()
          if (isBufferingStarted) {
            isBufferingStarted = false
          }
          break

        case BUFFERING:
          isBufferingStarted = true
          break

        case PAUSED:
          timer.stop()
          updateTime()
          console.log('PAUSED:', youtubePlayer.getCurrentTime(), currentTime)
          break

        case ENDED:
          console.log('ENDED')
          dispatch(finishSong())
          break

        case CUED:
          console.log('CUED')
          // if (getState().playlist.activeSong) {
          //   // TODO: Send duration info to server if app mode is host
          //   dispatch(playSong())
          // }
          break

        default:
          break
      }
    })

    dispatch({ type: actions.PLAYER_INITIALIZED, youtubePlayer })
  }
}

export function registerProgressBar(updatePercentage) {
  return { type: actions.PLAYER_REGISTER_PROGRESSBAR, updatePercentage }
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
  return { type: actions.PLAYER_STATE_REPLACED, payload }
}

export function updateYoutubePlayerState(youtubePlayerState) {
  return (dispatch, getState) => {
    if (youtubePlayerState === YOUTUBE_STATE.PLAYING || youtubePlayerState === YOUTUBE_STATE.CUED) {
      dispatch(updateUpdatingFlag()) // let playlist know activeItem has changed successfully
    }
    dispatch({ type: actions.PLAYER_YOUTUBE_STATE_UPDATED, youtubePlayerState })
  }
}

// Play next song and update playlist when the song finished
export function finishSong() {
  return (dispatch, getState) => {
    const { player, playlist } = getState()
    const { updatePercentage } = player

    updatePercentage(99.9)
    dispatch({ type: actions.PLAYER_FINISHED })
    dispatch(updateActiveSong(getNextSong(playlist)))
  }
}

export const initialState = {
  youtubePlayer: null,
  updatePercentage: null,
  youtubePlayerState: null,
  isPaused: false,
  isFinished: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYER_INITIALIZED:
      return { ...state,
        youtubePlayer: action.youtubePlayer,
      }
    case actions.PLAYER_FINISHED:
      return { ...state,
        currentVideoId: null,
        isFinished: true,
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
    case actions.PLAYER_YOUTUBE_STATE_UPDATED:
      return { ...state,
        youtubePlayerState: action.youtubePlayerState,
        isFinished: action.youtubePlayerState === YOUTUBE_STATE.ENDED,
      }
    case actions.PLAYER_STATE_REPLACED:
      return { ...state,
        isFinished: state.isFinished || action.isFinished,
        isPaused: state.isPaused || action.isPaused,
      }
    default:
      return state
  }
}
