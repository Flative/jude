import UUID from 'node-uuid';
import { updatePlayerVideo, playPlayer } from './playerReducer';

export const actions = {
  PLAYLIST_ITEM_ADDED: 'PLAYLIST_ITEM_ADDED',
  PLAYLIST_ITEM_REMOVED: 'PLAYLIST_ITEM_REMOVED',
  PLAYLIST_ACTIVE_ITEM_UPDATED: 'PLAYLIST_ACTIVE_ITEM_UPDATED',
};

export function getItemIndex(playlist, target) {
  return target ? playlist.items.findIndex(item => item.uuid === target.uuid) : null;
}

export function getActiveItemIndex(playlist) {
  return playlist.items.findIndex(item => item.uuid === playlist.activeItem.uuid);
}

export function getNextItem(playlist) {
  return playlist.activeItem ? playlist.items[getActiveItemIndex(playlist) + 1] : null;
}

export function getPrevItem(playlist) {
  return playlist.activeItem ? playlist.items[getActiveItemIndex(playlist) - 1] : null;
}

export function addItemToPlaylist(id, title) {
  return (dispatch, getState) => {
    const { playlist } = getState();
    const { activeItem, items } = playlist;

    const uuid = UUID.v4();
    const index = activeItem ? items[items.length - 1].index + 1 : 0;
    const item = { id, title, uuid, index };

    dispatch({
      type: actions.PLAYLIST_ITEM_ADDED,
      doesNextItemExist: activeItem ? true : false,
      item
    });

    if (!activeItem) {
      dispatch(updateActiveItemInPlaylist(item));
    }
  };
}

export function removeItemFromPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState();
    const { activeItem } = playlist;

    const itemIndex = getItemIndex(playlist, item);
    const nextItem = playlist.items[itemIndex + 1];

    dispatch({
      type: actions.PLAYLIST_ITEM_REMOVED,
      items: playlist.items.filter(v => v.uuid !== item.uuid),
      doesNextItemExist: !!nextItem,
    });

    if (activeItem.uuid === item.uuid) {
      dispatch(updateActiveItemInPlaylist(nextItem));
    }
  };
}

export function updateActiveItemInPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState();
    const { youtubePlayer, onPercentageChange } = player;
    const { activeItem, items } = playlist;

    onPercentageChange(0);

    dispatch({
      type: actions.PLAYLIST_ACTIVE_ITEM_UPDATED,
      doesNextItemExist: !!playlist.items[getItemIndex(playlist, item) + 1],
      item,
    });

    if (!item) {
      youtubePlayer.stopVideo();
    } else if (activeItem && (item.id === activeItem.id)) {
      youtubePlayer.seekTo(0);
      youtubePlayer.playVideo();
      // dispatch(playPlayer());
    }
  };
}

export const initialState = {
  items: [],
  doesNextItemExist: false,
  activeItem: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYLIST_ITEM_ADDED:
      return { ...state,
        items: [...state.items, action.item],
        doesNextItemExist: action.doesNextItemExist,
      };

    case actions.PLAYLIST_ITEM_REMOVED:
      return { ...state,
        items: action.items,
        doesNextItemExist: action.doesNextItemExist,
      };

    case actions.PLAYLIST_ACTIVE_ITEM_UPDATED:
      return { ...state,
        activeItem: action.item,
        doesNextItemExist: action.doesNextItemExist,
      };

    default:
      return state;
  }
};
