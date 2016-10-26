import UUID from 'node-uuid';
import { updateVideo } from './playerReducer';

export const actions = {
  PLAYLIST_ADDED: 'PLAYLIST_ADDED',
  PLAYLIST_REMOVED: 'PLAYLIST_REMOVED',
};

export function addPlaylist(id, title) {
  return (dispatch, getState) => {
    const { playlist, player } = getState();

    dispatch({
      type: actions.PLAYLIST_ADDED,
      item: {
        id,
        title,
        uuid: UUID.v4(),
      },
    });

    if (!playlist.data.length && !player.currentVideoId) {
      dispatch(updateVideo(id, 0));
    }
  };
}

export function removePlaylist(uuid) {
  return {
    type: actions.PLAYLIST_REMOVED,
    uuid,
  };
}

export const initialState = {
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYLIST_ADDED:
      return {
        data: [...state.data, action.item],
      };
    case actions.PLAYLIST_REMOVED:
      return {
        data: state.data.filter(item => item.uuid !== action.uuid),
      };
    default:
      return state;
  }
};
