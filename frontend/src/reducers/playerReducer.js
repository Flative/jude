import { updateActiveSong, getNextItem, enableRepeatAll } from './playlistReducer'
import { sleep } from '../utils/util'
import { APP_MODES } from './appReducer'

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
      currentTime = Math.floor(youtubePlayer.getCurrentTime())
      if (Math.abs(prevTime - currentTime) > 0) {
        const duration = youtubePlayer.getDuration()
        updatePercentage((currentTime / duration) * 100)
      }
    }

    const timer = {
      handler: null,
      start: () => timer.handler = setInterval(() => updateTime(), 100),
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
            dispatch(finishFetch())
            isBufferingStarted = false
          }
          break

        case BUFFERING:
          isBufferingStarted = true
          dispatch(startFetch())
          break

        case PAUSED:
          timer.stop()
          updateTime()
          console.log('PAUSED:', youtubePlayer.getCurrentTime(), currentTime)
          break

        case ENDED:
          console.log('ENDED')
          dispatch(finishPlayer())
          break

        case CUED:
          console.log('CUED')
          if (getState().playlist.activeSong) {
            // TODO: Send duration info to server if app mode is host
            dispatch(playSong())
          }
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
  return (dispatch, getState) => {
    getState().player.youtubePlayer.pauseVideo()
    dispatch({ type: actions.PLAYER_PAUSED })
  }
}

export function playSong() {
  return (dispatch, getState) => {
    dispatch({ type: actions.PLAYER_PLAYED })
  }
  // FIXME: it should be actual action that plays player
  // In this code, it just records PLYAER_PLAYED action was dispatched
}

// Fetching (buffering)
export function startFetch() {
  return { type: actions.PLAYER_FETCHING_STARTED }
}

export function finishFetch() {
  return { type: actions.PLAYER_FETCHING_FINISHED }
}

export function updateYoutubePlayerState(youtubePlayerState) {
  return { type: actions.PLAYER_YOUTUBE_STATE_UPDATED, youtubePlayerState }
}

// Play next song and update playlist when the song finished
export function finishPlayer() {
  return (dispatch, getState) => {
    const { player, playlist, app } = getState()
    const { youtubePlayer, updatePercentage } = player
    const { nextSong, songs, activeSong, shuffle, repeat } = playlist
    const { mode } = app

    updatePercentage(99.9)
    dispatch({ type: actions.PLAYER_FINISHED })

    dispatch(updateActiveSong(nextSong))

    // if (mode === APP_MODES.STANDALONE) {
    //   return;
    // }
    //
    // sleep(200).then(() => {
    //   if (shuffle) {
    //     const restItems = songs.filter(item => item.uuid !== activeSong.uuid)
    //     const length = restItems.length
    //
    //     if (!length) {
    //       dispatch(updateActiveSong(activeSong))
    //       return
    //     }
    //
    //     const randomItem = restItems[Math.floor(Math.random() * length)]
    //     dispatch(updateActiveSong(randomItem))
    //   } else if (repeat === 'one') {
    //     youtubePlayer.seekTo(0)
    //   } else if (repeat === 'all' && !playlist.doesNextItemExist) {
    //     const firstItem = songs[0]
    //     dispatch(updateActiveSong(firstItem))
    //   } else if (playlist.doesNextItemExist) {
    //     const nextItem = getNextItem(playlist)
    //     dispatch(updateActiveSong(nextItem))
    //     if (nextItem.id === activeSong.id) {
    //       youtubePlayer.seekTo(0)
    //     }
    //   } else {
    //     dispatch(updateActiveSong(null))
    //   }
    // })
  }
}

export const initialState = {
  youtubePlayer: null,
  updatePercentage: null,
  youtubePlayerState: null,
  isPaused: true,
  isFetching: true,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYER_INITIALIZED:
      return { ...state,
        youtubePlayer: action.youtubePlayer,
      }
    // case actions.PLAYER_VIDEO_UPDATED:
    //   return { ...state,
    //     currentVideoId: action.id,
    //   }
    case actions.PLAYER_FINISHED:
      return { ...state,
        currentVideoId: null,
        isPaused: true,
      }
    case actions.PLAYER_PLAYED:
      return { ...state,
        isPaused: false,
      }
    case actions.PLAYER_PAUSED:
      return { ...state,
        isPaused: true,
      }
    case actions.PLAYER_FETCHING_STARTED:
      return { ...state,
        isFetching: true,
      }
    case actions.PLAYER_FETCHING_FINISHED:
      return { ...state,
        isFetching: false,
      }
    case actions.PLAYER_REGISTER_PROGRESSBAR:
      return { ...state,
        updatePercentage: action.updatePercentage,
      }
    case actions.PLAYER_YOUTUBE_STATE_UPDATED:
      return { ...state,
        youtubePlayerState: action.youtubePlayerState,
      }
    default:
      return state
  }
}
