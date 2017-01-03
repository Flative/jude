import { APP_MODES } from '../reducers/appReducer'
import { actions as playlistActions } from '../reducers/playlistReducer'
import { actions as playerActions } from '../reducers/playerReducer'

const snatcher = store => next => action => {
  const { app } = store.getState()

  if (app.mode === APP_MODES.STANDALONE) {
    return next(action)
  }

  const { wsConnection } = app
  const send = (actionType, body) => wsConnection.send(JSON.stringify({
    action: actionType,
    body,
  }))

  if (action.type === playlistActions.PLAYLIST_SONG_ADDED) {
    send('add', action.song)
  } else if (action.type === playlistActions.PLAYLIST_SONG_REMOVED) {
    send('delete', action)
  }
}

export default snatcher
