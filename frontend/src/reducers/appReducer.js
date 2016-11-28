export const actions = {
  UPDATE_APP_TYPE: 'UPDATE_APP_TYPE',
}

export const appType = {
  standalone: 'standalone',
  host: 'host',
  client: 'client',
}

export function updateAppType(appType) {
  return { type: actions.CHANGE_APP_TYPE, appType }
}

export const defaultState = {
  appType: 'standalone',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.UPDATE_APP_TYPE:
      return {
        ...state,
        appType: action.appType,
      }
    default:
      return state
  }
}
