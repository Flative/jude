export const actions = {
  CHANGE_APP_MODE_ATTEMPTED: 'CHANGE_APP_MODE_ATTEMPTED',
  CHANGE_APP_MODE_FAILED: 'CHANGE_APP_MODE_FAILED',
  CHANGE_APP_MODE_SUCCEEDED: 'CHANGE_APP_MODE_SUCCEEDED',
}

export const APP_MODES = {
  STANDALONE: 'STANDALONE',
  HOST_CLIENT: 'HOST_CLIENT',
  CLIENT: 'CLIENT',
}

// export function sendUpdateActiveItem() {
//
// }

function establishWSConnection(dispatch, mode, address) {
  const wsConnection = new WebSocket(address)
  wsConnection.onerror = (e) => {
    dispatch({ action: actions.CHANGE_APP_MODE_FAILED })
  }
  wsConnection.onopen = (e) => {
    dispatch({ action: actions.CHANGE_APP_MODE_SUCCEEDED, mode, wsConnection })
  }
}

export function changeAppMode(mode, address) {
  return (dispatch, getState) => {
    const { wsConnection, isModeChanging } = getState().app

    if (isModeChanging) {
      console.warn('Mode changing is already attempting')
    }

    if (mode === APP_MODES.CLIENT) {
      dispatch({ action: actions.CHANGE_APP_MODE_SUCCEEDED, mode })
      return;
    }

    if (!wsConnection || wsConnection.url !== address) {
      establishWSConnection(dispatch, mode, address)
      return;
    }

    dispatch({ action: actions.CHANGE_APP_MODE_SUCCEEDED, mode, wsConnection })
  }
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
      return {
        ...state,
        isModeChanging: false,
      }
    case actions.CHANGE_APP_MODE_SUCCEEDED:
      return {
        ...state,
        isModeChanging: false,
        mode: action.mode,
        wsConnection: action.wsConnection,
      }
    default:
      return state
  }
}
