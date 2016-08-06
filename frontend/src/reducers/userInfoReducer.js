import extend from 'lodash/extend';
import { USER_INFO_UPDATED } from '../actions/userInfoAction';

const defaultState = {
  email: '',
  token: '',
};

export default function userInfoReducer(state = defaultState, action) {
  switch (action.type) {
    case USER_INFO_UPDATED:
      return extend({}, state, {
        email: action.email,
        token: action.token,
      });
    default:
      return state;
  }
}
