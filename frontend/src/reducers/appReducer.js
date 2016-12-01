export const actions = {
  UPDATE_APP_TYPE: 'UPDATE_APP_TYPE',
}

export const APP_MODES = {
  STANDALONE: 'STANDALONE',
  HOST_CLIENT: 'HOST_CLIENT',
  CLIENT: 'CLIENT',
}

export function updateAppType(mode) {
  return { type: actions.CHANGE_APP_TYPE, mode }
}

export const defaultState = {
  mode: APP_MODES.STANDALONE,
  wsConnection: null,
  serverState: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.UPDATE_APP_TYPE:
      return {
        ...state,
        mode: action.mode,
      }
    default:
      return state
  }
}
