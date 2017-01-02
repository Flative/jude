import { combineReducers } from 'redux'

const reducer = combineReducers({
  playlist: require('./playlistReducer').default,
  player: require('./playerReducer').default,
  app: require('./appReducer').default,
})

export default reducer
