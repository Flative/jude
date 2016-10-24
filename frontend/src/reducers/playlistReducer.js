import * as actions from '../actions/playlistAction';

const defaultState = {
  data: [],
};

export default function playlistReducer(state = defaultState, action) {
  switch(action.type) {
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
}
