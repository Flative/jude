import UUID from 'node-uuid'
import { APP_MODES } from './appReducer'

export const actions = {
  PLAYLIST_SONG_ADDED: 'PLAYLIST_SONG_ADDED',
  PLAYLIST_SONG_REMOVED: 'PLAYLIST_SONG_REMOVED',
  PLAYLIST_DATA_REPLACED: 'PLAYLIST_DATA_REPLACED',
  PLAYLIST_ACTIVE_SONG_UPDATED: 'PLAYLIST_ACTIVE_SONG_UPDATED',
  PLAYLIST_SHUFFLE_ENABLED: 'PLAYLIST_SHUFFLE_ENABLED',
  PLAYLIST_SHUFFLE_DISABLED: 'PLAYLIST_SHUFFLE_DISABLED',
  PLAYLIST_SHUFFLE_STATE_UPDATED: 'PLAYLIST_SHUFFLE_STATE_UPDATED',
  PLAYLIST_REPEAT_STATE_UPDATED: 'PLAYLIST_REPEAT_STATE_UPDATED',
  PLAYLIST_REPEAT_ONE_ENABLED: 'PLAYLIST_REPEAT_ONE_ENABLED',
  PLAYLIST_REPEAT_ALL_ENABLED: 'PLAYLIST_REPEAT_ALL_ENABLED',
  PLAYLIST_REPEAT_DISABLED: 'PLAYLIST_REPEAT_DISABLED',
  PLAYLIST_UPDATING_FLAG_UPDATED: 'PLAYLIST_UPDATING_FLAG_UPDATED',
}

export function getItemIndex(playlist, target) {
  return target ? playlist.songs.findIndex(item => item.uuid === target.uuid) : null
}

export function getActiveItemIndex(playlist) {
  return playlist.songs.findIndex(item => item.uuid === playlist.activeSong.uuid)
}

export function getNextSongIndex(playlist) {
  const { activeSong, songs, nextSong } = playlist
  const uuid = UUID.v4()
  return activeSong ? songs[songs.length - 1].index + 1 : 0
}

export function getNextSong(playlist, criteriaSong) {
  const { songs, shuffle, repeat, activeSong } = playlist
  criteriaSong = criteriaSong || activeSong

  if (shuffle) {
    return songs[Math.floor(Math.random() * songs.length)]
  } else {
    return criteriaSong
      ? songs[songs.findIndex(v => v.uuid === criteriaSong.uuid) + 1] || null
      : null
  }
}

export function getPrevItem(playlist) {
  return playlist.activeSong ? playlist.songs[getActiveItemIndex(playlist) - 1] : null
}

export function addSong(id, title) {
  return (dispatch, getState) => {
    const { playlist } = getState()
    const { activeSong, songs } = playlist
    const uuid = UUID.v4()
    const index = activeSong ? songs[songs.length - 1].index + 1 : 0

    const song = { id, title, uuid, index }

    dispatch({
      type: actions.PLAYLIST_SONG_ADDED,
      song,
    })
  }
}

export function removeSong(item) {
  return (dispatch, getState) => {
    const { playlist } = getState()
    const { activeSong } = playlist

    dispatch({
      type: actions.PLAYLIST_SONG_REMOVED,
      songs: playlist.songs.filter(v => v.uuid !== item.uuid),
      activeSong: item.uuid === activeSong.uuid ? null : activeSong,
    })
  }
}

export function updateActiveSong(activeSong) {
  return (dispatch, getState) => {
    const { playlist, player } = getState()
    const { youtubePlayer, updatePercentage } = player
    const { songs } = playlist

    dispatch({
      type: actions.PLAYLIST_ACTIVE_SONG_UPDATED,
      activeSong,
    })

    // if (!song) {
    //   youtubePlayer.stopVideo()
    // } else if (activeSong && (song.id === activeSong.id)) {
    //   youtubePlayer.seekTo(0)
    // }
  }
}

export function replacePlaylistData(payload) {
  return {
    type: actions.PLAYLIST_DATA_REPLACED,
    ...payload,
  }
}

export function updateShuffleState(shuffle) {
  return { type: actions.PLAYLIST_SHUFFLE_STATE_UPDATED, shuffle }
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

export function updateUpdatingFlag() {
  return { type: actions.PLAYLIST_UPDATING_FLAG_UPDATED }
}

export const initialState = {
  songs: [],
  shuffle: false,
  repeat: false,
  activeSong: null,
  nextItem: null,
  hasPlaylistUpdated: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYLIST_SONG_ADDED:
      return { ...state,
        songs: [...state.songs, action.song],
      }

    case actions.PLAYLIST_SONG_REMOVED:
      return { ...state,
        songs: action.songs,
        activeSong: action.activeSong,
      }

    case actions.PLAYLIST_DATA_REPLACED:
      const activeSongIndex = action.activeSong ? action.songs.findIndex(v => v.uuid === action.activeSong.uuid) : -1

      return {
        songs: action.songs,
        activeSong: action.activeSong,
        shuffle: action.isShuffleOn,
        repeat: action.repeatingMode === 'none' ? false : action.repeatingMode,
      }

    case actions.PLAYLIST_ACTIVE_SONG_UPDATED:
      return { ...state,
        activeSong: action.activeSong,
        hasPlaylistUpdated: true,
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

    case actions.PLAYLIST_SHUFFLE_STATE_UPDATED:
      return { ...state,
        shuffle: action.shuffle,
      }

    case actions.PLAYLIST_UPDATING_FLAG_UPDATED:
      return { ...state,
        hasPlaylistUpdated: false,
      }

    default:
      return state
  }
}
