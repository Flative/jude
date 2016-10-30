import UUID from 'node-uuid';
import { updateVideo } from './playerReducer';

export const actions = {
  PLAYLIST_ADDED: 'PLAYLIST_ADDED',
  PLAYLIST_REMOVED: 'PLAYLIST_REMOVED',
  PLAYLIST_ACTIVE_ITEM_UPDATED: 'PLAYLIST_ACTIVE_ITEM_UPDATED',
};

export function addPlaylist(id, title) {
  return (dispatch, getState) => {
    const { playlist, player } = getState();
    const uuid = UUID.v4();

    dispatch({
      type: actions.PLAYLIST_ADDED,
      item: {
        id,
        title,
        uuid,
      },
    });

    if (!playlist.items.length && !player.currentVideoId) {
      dispatch(updateVideo(id, 0));
      dispatch(updateActiveItem(uuid));
    }
  };
}

export function removePlaylist(uuid) {
  return {
    type: actions.PLAYLIST_REMOVED,
    uuid,
  };
}

export function updateActiveItem(uuid) {
  return {
    type: actions.PLAYLIST_ACTIVE_ITEM_UPDATED,
    uuid,
  };
}

export const initialState = {
  items: [],
  activeItemUUID: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYLIST_ADDED:
      return { ...state,
        items: [...state.items, action.item],
      };
    case actions.PLAYLIST_REMOVED:
      return { ...state,
        items: state.items.filter(item => item.uuid !== action.uuid),
      };
    case actions.PLAYLIST_ACTIVE_ITEM_UPDATED:
      return { ...state,
        activeItemUUID: action.uuid,
      };
    default:
      return state;
  }
};
