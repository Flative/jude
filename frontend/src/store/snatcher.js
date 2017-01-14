import { APP_MODES } from '../reducers/appReducer'
import { actions as playlistActions } from '../reducers/playlistReducer'
import { actions as playerActions } from '../reducers/playerReducer'

const snatcher = store => next => action => {
  const { app } = store.getState()

  const result = next(action)
  if (app.mode === APP_MODES.STANDALONE ||
    !action.type ||
    action.type === playlistActions.PLAYLIST_STATE_REPLACED ||
    action.type === playerActions.PLAYER_STATE_REPLACED ||
    action.type === playerActions.PLAYER_REGISTERED
  ) {
    return result
  }

  const { wsConnection } = app
  const state = store.getState()

  try {
    if (wsConnection.readyState === wsConnection.OPEN) {
      wsConnection.send(JSON.stringify({
        action: 'update',
        body: {
          playlist: state.playlist,
          player: {
            ...state.player,
            updatePercentage: null,
            youtubePlayer: null,
          },
        },
      }))
    }
  } catch (e) {
    console.warn(e)
  }

  return { type: 'WS_SEND_DATA_ATTEMPTED' }
}

export default snatcher

