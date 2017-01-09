import UUID from 'node-uuid'

export const actions = {
  PLAYLIST_SONG_ADDED: 'PLAYLIST_SONG_ADDED',
  PLAYLIST_SONG_REMOVED: 'PLAYLIST_SONG_REMOVED',
  PLAYLIST_STATE_REPLACED: 'PLAYLIST_STATE_REPLACED',
  PLAYLIST_ACTIVE_SONG_UPDATED: 'PLAYLIST_ACTIVE_SONG_UPDATED',
  PLAYLIST_SHUFFLE_STATE_UPDATED: 'PLAYLIST_SHUFFLE_STATE_UPDATED',
  PLAYLIST_REPEAT_STATE_UPDATED: 'PLAYLIST_REPEAT_STATE_UPDATED',
  PLAYLIST_UPDATING_FLAG_UPDATED: 'PLAYLIST_UPDATING_FLAG_UPDATED',
}

export function getItemIndex(playlist, target) {
  return target ? playlist.songs.findIndex(item => item.uuid === target.uuid) : null
}

export function getActiveItemIndex(playlist) {
  return playlist.songs.findIndex(item => item.uuid === playlist.activeSong.uuid)
}

export function getNextSongIndex(playlist) {
  const { activeSong, songs } = playlist
  return activeSong ? songs[songs.length - 1].index + 1 : 0
}

export function getNextSong(playlist, criteriaSong) {
  const { songs, shuffle, repeat, activeSong } = playlist
  const _criteriaSong = criteriaSong || activeSong

  if (shuffle) {
    return songs[Math.floor(Math.random() * songs.length)]
  } else if (repeat) {
    if (repeat === 'one') {
      return activeSong
    }
    const nextSong = songs[songs.findIndex(v => v.uuid === activeSong.uuid) + 1] || null
    return nextSong || songs[0]
  }

  return _criteriaSong
    ? songs[songs.findIndex(v => v.uuid === _criteriaSong.uuid) + 1] || null
    : null
}

export function getPrevItem(playlist) {
  const { activeSong, songs } = playlist
  if (!activeSong || !songs.length) {
    return null
  }

  const prevIndexItem = songs[songs.findIndex(v => v.uuid === activeSong.uuid) - 1]

  return prevIndexItem || songs[0]
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
    const hasActiveSongDeleted = activeSong && activeSong.uuid === item.uuid
    const nextSong = getNextSong(playlist)

    dispatch({
      type: actions.PLAYLIST_SONG_REMOVED,
      songs: playlist.songs.filter(v => v.uuid !== item.uuid),
      activeSong: hasActiveSongDeleted ? nextSong : activeSong,
      hasPlaylistUpdated: hasActiveSongDeleted, // Force update
    })
  }
}

export function updateActiveSong(activeSong) {
  return { type: actions.PLAYLIST_ACTIVE_SONG_UPDATED, activeSong }
}

export function replacePlaylistState(payload) {
  return {
    type: actions.PLAYLIST_STATE_REPLACED,
    ...payload,
  }
}

export function updateShuffleState(shuffle) {
  return { type: actions.PLAYLIST_SHUFFLE_STATE_UPDATED, shuffle }
}

export function updateRepeatState(repeat) {
  return { type: actions.PLAYLIST_REPEAT_STATE_UPDATED, repeat }
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
        hasPlaylistUpdated: action.hasPlaylistUpdated,
      }

    case actions.PLAYLIST_STATE_REPLACED:
      return {
        songs: action.songs || [],
        activeSong: action.activeSong || null,
        shuffle: action.shuffle || false,
        repeat: action.repeat || false,
        hasPlaylistUpdated: action.hasPlaylistUpdated || false,
      }

    case actions.PLAYLIST_ACTIVE_SONG_UPDATED:
      return { ...state,
        activeSong: action.activeSong,
        hasPlaylistUpdated: true,
      }

    case actions.PLAYLIST_REPEAT_STATE_UPDATED:
      return { ...state,
        repeat: action.repeat,
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
