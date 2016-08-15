export const TOKEN_UPDATED = 'TOKEN_UPDATED';

export function updateToken(token) {
  return {
    type: TOKEN_UPDATED,
    token,
  }
}
