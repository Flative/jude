import { replacePlaylistState, initialState as playlistInitialState } from './playlistReducer'
import {
  replacePlayerState, registerPlayer, initialState as playerInitialState,
} from './playerReducer'

export const actions = {
  CHANGE_APP_MODE_ATTEMPTED: 'CHANGE_APP_MODE_ATTEMPTED',
  CHANGE_APP_MODE_FAILED: 'CHANGE_APP_MODE_FAILED',
  CHANGE_APP_MODE_SUCCEEDED: 'CHANGE_APP_MODE_SUCCEEDED',
  WS_SEND_DATA_ATTEMPTED: 'SEND_DATA_ATTEMPTED',
}

export const APP_MODES = {
  STANDALONE: 'STANDALONE',
  SPEAKER: 'SPEAKER',
  CONTROLLER: 'CONTROLLER',
}

export function changeAppMode(newMode) {
  return (dispatch, getState) => {
    const { isModeChanging, wsConnection } = getState().app

    if (isModeChanging) {
      return;
    }

    dispatch({ type: actions.CHANGE_APP_MODE_ATTEMPTED })

    if (newMode === APP_MODES.STANDALONE) {
      try {
        wsConnection.close()
        dispatch({
          type: actions.CHANGE_APP_MODE_SUCCEEDED,
          wsConnection: null,
          mode: newMode,
        })

        dispatch(replacePlaylistState(playlistInitialState))
        dispatch(replacePlayerState(playerInitialState))
      } catch (e) {
        dispatch({ type: actions.CHANGE_APP_MODE_FAILED, e })
      }
      return;
    }

    try {
      const newWsConnection = new WebSocket(`ws://${location.hostname}:8000/ws`)
      newWsConnection.onerror = (e) => {
        dispatch({ type: actions.CHANGE_APP_MODE_FAILED, e })
      }
      newWsConnection.onopen = () => {
        dispatch({
          type: actions.CHANGE_APP_MODE_SUCCEEDED,
          wsConnection: newWsConnection,
          mode: newMode,
        })
        if (newMode === APP_MODES.CONTROLLER) {
          const noop = () => null
          dispatch(registerPlayer({
            pauseVideo: noop,
            playVideo: noop,
            seekTo: noop,
            setVolume: noop,
          }))
        }
        newWsConnection.send(JSON.stringify({
          action: 'init',
          body: {
            type: newMode,
          },
        }))
      }
      newWsConnection.onmessage = (msg) => {
        let res
        try {
          res = JSON.parse(msg.data)
        } catch (e) {
          res = {}
        }
        const { playlist, player } = res

        if (playlist) {
          dispatch(replacePlaylistState(playlist))
        }
        if (player) {
          dispatch(replacePlayerState(player))
        }
      }
      newWsConnection.onclose = () => {
        alert('Oops! something went wrong. please try again.')
        window.location = '/'
      }
    } catch (e) {
      dispatch({ type: actions.CHANGE_APP_MODE_FAILED })
    }
  };
}

export function disconnectWSConnection(cb) {
  return (dispatch, getState) => {
    const { wsConnection } = getState().app

    dispatch({ type: actions.CHANGE_APP_MODE_ATTEMPTED })

    try {
      wsConnection.close()
      dispatch({
        type: actions.CHANGE_APP_MODE_SUCCEEDED,
        mode: APP_MODES.STANDALONE,
        wsConnection: null,
      })
      if (cb) {
        cb()
      }
    } catch (e) {
      dispatch({ type: actions.CHANGE_APP_MODE_FAILED })
      if (cb) {
        cb()
      }
    }
  };
}

export const defaultState = {
  mode: APP_MODES.STANDALONE,
  isModeChanging: false,
  wsConnection: null,
  serverState: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.CHANGE_APP_MODE_ATTEMPTED:
      return {
        ...state,
        isModeChanging: true,
      }
    case actions.CHANGE_APP_MODE_FAILED:
      alert('Oops, something went wrong!') // FIXME
      return {
        ...state,
        isModeChanging: false,
      }
    case actions.CHANGE_APP_MODE_SUCCEEDED:
      return {
        ...state,
        isModeChanging: false,
        mode: action.mode || state.mode,
        wsConnection: action.wsConnection,
      }
    default:
      return state
  }
}
