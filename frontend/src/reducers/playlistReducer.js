import * as actions from '../actions/playlistAction';

const defaultState = {
  data: [{
    id: 1234,
    uuid: '1234',
    title: '12341234123421341234342341234123142123431423124341212343421'
  }],
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
