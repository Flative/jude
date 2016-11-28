import UUID from 'node-uuid'

export const actions = {
  PLAYLIST_ITEM_ADDED: 'PLAYLIST_ITEM_ADDED',
  PLAYLIST_ITEM_REMOVED: 'PLAYLIST_ITEM_REMOVED',
  PLAYLIST_ACTIVE_ITEM_UPDATED: 'PLAYLIST_ACTIVE_ITEM_UPDATED',
  PLAYLIST_SHUFFLE_ENABLED: 'PLAYLIST_SHUFFLE_ENABLED',
  PLAYLIST_SHUFFLE_DISABLED: 'PLAYLIST_SHUFFLE_DISABLED',
  PLAYLIST_REPEAT_ONE_ENABLED: 'PLAYLIST_REPEAT_ONE_ENABLED',
  PLAYLIST_REPEAT_ALL_ENABLED: 'PLAYLIST_REPEAT_ALL_ENABLED',
  PLAYLIST_REPEAT_DISABLED: 'PLAYLIST_REPEAT_DISABLED',
}

export function getItemIndex(playlist, target) {
  return target ? playlist.items.findIndex(item => item.uuid === target.uuid) : null
}

export function getActiveItemIndex(playlist) {
  return playlist.items.findIndex(item => item.uuid === playlist.activeItem.uuid)
}

export function getNextItem(playlist) {
  return playlist.activeItem ? playlist.items[getActiveItemIndex(playlist) + 1] : null
}

export function getPrevItem(playlist) {
  return playlist.activeItem ? playlist.items[getActiveItemIndex(playlist) - 1] : null
}

export function addItemToPlaylist(id, title) {
  return (dispatch, getState) => {
    const { playlist, app } = getState()
    const { activeItem, items } = playlist
    const { appType } = app

    if (appType === 'client') {
      // TODO:
      return
    }

    const uuid = UUID.v4()
    const index = activeItem ? items[items.length - 1].index + 1 : 0
    const item = { id, title, uuid, index }

    dispatch({
      type: actions.PLAYLIST_ITEM_ADDED,
      doesNextItemExist: !!activeItem,
      item,
    })

    if (!activeItem) {
      dispatch(updateActiveItemInPlaylist(item))
    }
  }
}

export function removeItemFromPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState()
    const { activeItem } = playlist

    const itemIndex = getItemIndex(playlist, item)
    const nextItem = playlist.items[itemIndex + 1]

    dispatch({
      type: actions.PLAYLIST_ITEM_REMOVED,
      items: playlist.items.filter(v => v.uuid !== item.uuid),
      doesNextItemExist: !!nextItem,
    })

    if (activeItem.uuid === item.uuid) {
      dispatch(updateActiveItemInPlaylist(nextItem))
    }
  }
}

export function updateActiveItemInPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState()
    const { youtubePlayer, updatePercentage } = player
    const { activeItem, items } = playlist

    updatePercentage(0)

    dispatch({
      type: actions.PLAYLIST_ACTIVE_ITEM_UPDATED,
      doesNextItemExist: !!playlist.items[getItemIndex(playlist, item) + 1],
      item,
    })

    if (!item) {
      youtubePlayer.stopVideo()
    } else if (activeItem && (item.id === activeItem.id)) {
      youtubePlayer.seekTo(0)
    }
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
  items: [],
  doesNextItemExist: false,
  shuffle: false,
  repeat: false,
  activeItem: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYLIST_ITEM_ADDED:
      return { ...state,
        items: [...state.items, action.item],
        doesNextItemExist: action.doesNextItemExist,
      }

    case actions.PLAYLIST_ITEM_REMOVED:
      return { ...state,
        items: action.items,
        doesNextItemExist: action.doesNextItemExist,
      }

    case actions.PLAYLIST_ACTIVE_ITEM_UPDATED:
      return { ...state,
        activeItem: action.item,
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
