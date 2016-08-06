// TODO: implements actions that control further information about user
export const USER_INFO_UPDATED = 'USER_INFO_UPDATED';

export const updateUserInfo = (info) => ({
  type: USER_INFO_UPDATED,
  ...info,
});
