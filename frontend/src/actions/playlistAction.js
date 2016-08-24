export const PLAYLIST_ADDED = 'PLAYLIST_ADDED';
export const PLAYLIST_REMOVED = 'PLAYLIST_REMOVED';

export function addPlaylist(id, title) {
  return {
    type: PLAYLIST_ADDED,
    item: { id, title },
  };
}

export function removePlaylist(item) {
  return {
    type: PLAYLIST_REMOVED,
    item,
  }
}
