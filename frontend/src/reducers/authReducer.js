import * as actions from '../actions/authAction';
import { CLIENT_ID } from '../appInfo';

const defaultState = {
  isLoggedIn: false,
  token: {},
};

export default function authReducer(state = defaultState, action) {
  switch(action.type) {
    case actions.TOKEN_UPDATED:
      // Make sure audience value matches client_id of jude
      // https://developers.google.com/youtube/2.0/developers_guide_protocol_oauth2
      if (action.token.audience === CLIENT_ID) {
        return {
          ...state,
          isLoggedIn: true,
          token: action.token,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
