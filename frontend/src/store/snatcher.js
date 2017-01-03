import { APP_MODES } from '../reducers/appReducer'
import { actions as playlistActions } from '../reducers/playlistReducer'
import { actions as playerActions } from '../reducers/playerReducer'

const snatcher = store => next => action => {
  const { app } = store.getState()

  const result = next(action)
  if (app.mode === APP_MODES.STANDALONE ||
    action.type === playlistActions.PLAYLIST_STATE_REPLACED ||
    action.type === playerActions.PLAYER_STATE_REPLACED
  ) {
    return result
  }

  const { wsConnection } = app
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

