export const withPrefix = (api) => `http://52.78.47.28/api/v1${api}`

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export const noop = () => {}
