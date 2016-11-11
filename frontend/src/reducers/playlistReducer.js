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
    const { activeItem } = playlist;

    const uuid = UUID.v4();
    const index = activeItem && activeItem.index ? activeItem.index + 1 : 0;
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
    dispatch({
      type: actions.PLAYLIST_ACTIVE_ITEM_UPDATED,
      doesNextItemExist: !!getState().playlist.items[item.index + 1],
      item,
    });
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
