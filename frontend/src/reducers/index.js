import { combineReducers } from 'redux';

const reducer = combineReducers({
  auth: require('./authReducer').default,
  playlist: require('./playlistReducer').default,
  player: require('./playerReducer').default,
});

export default reducer;
