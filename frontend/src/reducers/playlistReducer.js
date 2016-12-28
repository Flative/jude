import UUID from 'node-uuid'
import { APP_MODES } from './appReducer'

export const actions = {
  PLAYLIST_ITEM_ADDED: 'PLAYLIST_ITEM_ADDED',
  PLAYLIST_ITEM_REMOVED: 'PLAYLIST_ITEM_REMOVED',
  PLAYLIST_DATA_REPLACED: 'PLAYLIST_DATA_REPLACED',
  PLAYLIST_ACTIVE_ITEM_UPDATED: 'PLAYLIST_ACTIVE_ITEM_UPDATED',
  PLAYLIST_SHUFFLE_ENABLED: 'PLAYLIST_SHUFFLE_ENABLED',
  PLAYLIST_SHUFFLE_DISABLED: 'PLAYLIST_SHUFFLE_DISABLED',
  PLAYLIST_REPEAT_ONE_ENABLED: 'PLAYLIST_REPEAT_ONE_ENABLED',
  PLAYLIST_REPEAT_ALL_ENABLED: 'PLAYLIST_REPEAT_ALL_ENABLED',
  PLAYLIST_REPEAT_DISABLED: 'PLAYLIST_REPEAT_DISABLED',
}

export function getItemIndex(playlist, target) {
  return target ? playlist.songs.findIndex(item => item.uuid === target.uuid) : null
}

export function getActiveItemIndex(playlist) {
  return playlist.songs.findIndex(item => item.uuid === playlist.activeSong.uuid)
}

export function getNextItem(playlist) {
  return playlist.activeSong ? playlist.songs[getActiveItemIndex(playlist) + 1] : null
}

export function getPrevItem(playlist) {
  return playlist.activeSong ? playlist.songs[getActiveItemIndex(playlist) - 1] : null
}

export function addItemToPlaylist(id, title) {
  return (dispatch, getState) => {
    const { playlist, app } = getState()
    const { activeSong, songs } = playlist
    const { mode } = app

    const uuid = UUID.v4()
    const index = activeSong ? songs[songs.length - 1].index + 1 : 0

    const item = { id, title, uuid, index }

    dispatch({
      type: actions.PLAYLIST_ITEM_ADDED,
      doesNextItemExist: !!activeSong,
      item,
    })

    if (!activeSong) {
      if (mode === APP_MODES.STANDALONE) {
        dispatch(updateActiveItemInPlaylist(item))
        return
      }

      // TODO:
    }
  }
}

export function removeItemFromPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState()
    const { activeSong } = playlist

    const itemIndex = getItemIndex(playlist, item)
    const nextItem = playlist.songs[itemIndex + 1]

    dispatch({
      type: actions.PLAYLIST_ITEM_REMOVED,
      songs: playlist.songs.filter(v => v.uuid !== item.uuid),
      doesNextItemExist: !!nextItem,
    })

    if (activeSong.uuid === item.uuid) {
      dispatch(updateActiveItemInPlaylist(nextItem))
    }
  }
}

export function updateActiveItemInPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState()
    const { youtubePlayer, updatePercentage } = player
    const { activeSong, songs } = playlist

    updatePercentage(0)

    dispatch({
      type: actions.PLAYLIST_ACTIVE_ITEM_UPDATED,
      doesNextItemExist: !!playlist.songs[getItemIndex(playlist, item) + 1],
      item,
    })

    if (!item) {
      youtubePlayer.stopVideo()
    } else if (activeSong && (item.id === activeSong.id)) {
      youtubePlayer.seekTo(0)
    }
  }
}

export function replacePlaylistData(payload) {
  return {
    type: actions.PLAYLIST_DATA_REPLACED,
    ...payload,
  }
}

export function enableShuffle() {
  return (dispatch, getState) => {
    dispatch({ type: actions.PLAYLIST_SHUFFLE_ENABLED })
    dispatch(enableRepeatAll())
  }
}

export function disableShuffle() {
  return { type: actions.PLAYLIST_SHUFFLE_DISABLED }
}

export function enableRepeatOne() {
  return { type: actions.PLAYLIST_REPEAT_ONE_ENABLED }
}

export function enableRepeatAll() {
  return { type: actions.PLAYLIST_REPEAT_ALL_ENABLED }
}

export function disableRepeat() {
  return { type: actions.PLAYLIST_REPEAT_DISABLED }
}

export const initialState = {
  songs: [],
  shuffle: false,
  repeat: false,
  activeSong: null,
  nextItem: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYLIST_ITEM_ADDED:
      return { ...state,
        songs: [...state.songs, action.item],
        doesNextItemExist: action.doesNextItemExist,
      }

    case actions.PLAYLIST_ITEM_REMOVED:
      return { ...state,
        songs: action.songs,
        doesNextItemExist: action.doesNextItemExist,
      }

    case actions.PLAYLIST_DATA_REPLACED:
      const activeSongIndex = action.activeSong ? action.songs.findIndex(v => v.uuid === action.activeSong.uuid) : -1

      return {
        songs: action.songs,
        activeSong: action.activeSong,
        doesNextItemExist: activeSongIndex !== -1 ? !!action.songs[activeSongIndex + 1] : false,
        shuffle: action.isShuffleOn,
        repeat: action.repeatingMode === 'none' ? false : action.repeatingMode,
      }

    case actions.PLAYLIST_ACTIVE_ITEM_UPDATED:
      return { ...state,
        activeSong: action.item,
        doesNextItemExist: action.doesNextItemExist,
      }

    case actions.PLAYLIST_SHUFFLE_ENABLED:
      return { ...state,
        shuffle: true,
      }

    case actions.PLAYLIST_SHUFFLE_DISABLED:
      return { ...state,
        shuffle: false,
      }

    case actions.PLAYLIST_REPEAT_ONE_ENABLED:
      return { ...state,
        repeat: 'one',
      }

    case actions.PLAYLIST_REPEAT_ALL_ENABLED:
      return { ...state,
        repeat: 'all',
      }

    case actions.PLAYLIST_REPEAT_DISABLED:
      return { ...state,
        repeat: false,
      }

    default:
      return state
  }
}
