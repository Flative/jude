import UUID from 'node-uuid';
import { updatePlayerVideo, playPlayer } from './playerReducer';

export const actions = {
  PLAYLIST_ADDED: 'PLAYLIST_ADDED',
  PLAYLIST_REMOVED: 'PLAYLIST_REMOVED',
  PLAYLIST_ACTIVE_ITEM_UPDATED: 'PLAYLIST_ACTIVE_ITEM_UPDATED',
};

export function addItemToPlaylist(id, title) {
  return (dispatch, getState) => {
    const { playlist } = getState();
    const { activeItem, items } = playlist;

    const uuid = UUID.v4();
    const index = activeItem ? items.length : 0;
    const item = { id, title, uuid, index };

    dispatch({
      type: actions.PLAYLIST_ADDED,
      doesNextItemExist: activeItem ? true : false,
      item
    });

    if (!activeItem) {
      dispatch(updateActiveItemInPlaylist(item));
    }
  };
}

export function removeItemFromPlaylist(uuid) {
  return {
    type: actions.PLAYLIST_REMOVED,
    uuid,
  };
}

export function updateActiveItemInPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState();
    const { youtubePlayer } = player;
    const { activeItem, items } = playlist;

    dispatch({
      type: actions.PLAYLIST_ACTIVE_ITEM_UPDATED,
      doesNextItemExist: !!items[item.index + 1],
      item,
    });

    if (activeItem && (item.id === activeItem.id)) {
      youtubePlayer.seekTo(0);
      youtubePlayer.playVideo();
      dispatch(playPlayer());
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
    case actions.PLAYLIST_ADDED:
      return { ...state,
        items: [...state.items, action.item],
        doesNextItemExist: action.doesNextItemExist,
      };

    case actions.PLAYLIST_REMOVED:
      return { ...state,
        items: state.items.filter(item => item.uuid !== action.uuid),
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
