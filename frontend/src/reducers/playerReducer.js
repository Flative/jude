import { updateActiveItemInPlaylist, getNextItem, enableRepeatAll } from './playlistReducer'
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
}

// Store player instance to redux state tree when initializing
export function registerPlayer(youtubePlayer) {
  window.player = youtubePlayer
  return (dispatch, getState) => {
    const { ENDED, PLAYING, PAUSED, BUFFERING, CUED } = YT.PlayerState
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
        // dispatch(updateProgressBarPercentage((currentTime / duration) * 100))
      }
    }

    const timer = {
      handler: null,
      start: () => timer.handler = setInterval(() => updateTime(), 100),
      stop: () => clearTimeout(timer.handler),
    }

    youtubePlayer.addEventListener('onStateChange', (e) => {
      switch (e.data) {
        case PLAYING:
          console.log('PLAYING')
          timer.stop()
          timer.start()
          dispatch(playPlayer())
          break

        case BUFFERING:
          isBufferingStarted = true
          dispatch(startFetch())
          break

        case PAUSED:
          timer.stop()
          updateTime()
          console.log('PAUSED:', youtubePlayer.getCurrentTime(), currentTime)
          if (isBufferingStarted) {
            dispatch(finishFetch())
            isBufferingStarted = false
          }
          break

        case ENDED:
          console.log('ENDED')
          dispatch(finishPlayer())
          break

        case CUED:
          console.log('CUED')
          if (getState().playlist.activeItem) {
            // TODO: Send duration info to server if app mode is host
            youtubePlayer.playVideo()
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

export function pausePlayer() {
  return (dispatch, getState) => {
    getState().player.youtubePlayer.pauseVideo()
    dispatch({ type: actions.PLAYER_PAUSED })
  }
}

export function playPlayer() {
  // FIXME: it should be actual action that plays player
  // In this code, it just records PLYAER_PLAYED action was dispatched
  return { type: actions.PLAYER_PLAYED };
}

// Fetching (buffering)
export function startFetch() {
  return { type: actions.PLAYER_FETCHING_STARTED }
}

export function finishFetch() {
  return { type: actions.PLAYER_FETCHING_FINISHED }
}

// Play next song and update playlist when the song finished
export function finishPlayer() {
  return (dispatch, getState) => {
    const { player, playlist, app } = getState()
    const { youtubePlayer, updatePercentage } = player
    const { items, activeItem, shuffle, repeat } = playlist
    const { mode } = app

    updatePercentage(99.9)
    dispatch({ type: actions.PLAYER_FINISHED })

    if (mode === APP_MODES.STANDALONE) {
      return;
    }

    sleep(200).then(() => {
      if (shuffle) {
        const restItems = items.filter(item => item.uuid !== activeItem.uuid)
        const length = restItems.length

        if (!length) {
          dispatch(updateActiveItemInPlaylist(activeItem))
          return
        }

        const randomItem = restItems[Math.floor(Math.random() * length)]
        dispatch(updateActiveItemInPlaylist(randomItem))
      } else if (repeat === 'one') {
        youtubePlayer.seekTo(0)
      } else if (repeat === 'all' && !playlist.doesNextItemExist) {
        const firstItem = items[0]
        dispatch(updateActiveItemInPlaylist(firstItem))
      } else if (playlist.doesNextItemExist) {
        const nextItem = getNextItem(playlist)
        dispatch(updateActiveItemInPlaylist(nextItem))
        if (nextItem.id === activeItem.id) {
          youtubePlayer.seekTo(0)
        }
      } else {
        dispatch(updateActiveItemInPlaylist(null))
      }
    })
  }
}

export const initialState = {
  youtubePlayer: null,
  updatePercentage: null,
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
    default:
      return state
  }
}
