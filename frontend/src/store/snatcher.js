import { APP_MODES } from '../reducers/appReducer'
import { actions as playlistActions } from '../reducers/playlistReducer'
import { actions as playerActions } from '../reducers/playerReducer'

const snatcher = store => next => action => {
  const { app } = store.getState()

  if (app.mode === APP_MODES.STANDALONE || action.type === playlistActions.PLAYLIST_DATA_REPLACED) {
    return next(action)
  }

  const { wsConnection } = app
  next(action)

  const state = store.getState()

  wsConnection.send(JSON.stringify({
    playlist: state.playlist,
    player: {
      isPaused: state.player.isPaused,
      isFinished: state.player.isFinished,
    },
  }))

  return { type: 'WS_SEND_DATA_ATTEMPTED' }
}

export default snatcher

