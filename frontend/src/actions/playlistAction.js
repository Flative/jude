import uuid from 'node-uuid';
import { updateVideo } from '../actions/playerAction'

export const PLAYLIST_ADDED = 'PLAYLIST_ADDED';
export const PLAYLIST_REMOVED = 'PLAYLIST_REMOVED';

export function addPlaylist(id, title) {
  return (dispatch, getState) => {
    const { playlist, player } = getState();

    dispatch({
      type: PLAYLIST_ADDED,
      item: {
        id,
        title,
        uuid: uuid.v4(),
      },
    });

    if (!playlist.data.length && !player.currentVideoId) {
      dispatch(updateVideo(id, 0));
    }
  };
}

export function removePlaylist(uuid) {
  return {
    type: PLAYLIST_REMOVED,
    uuid,
  };
}
