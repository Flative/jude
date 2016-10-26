import { combineReducers } from 'redux';

const reducer = combineReducers({
  playlist: require('./playlistReducer').default,
  player: require('./playerReducer').default,
});

export default reducer;
