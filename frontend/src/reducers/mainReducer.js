import { combineReducers } from 'redux';
import * as actions from '../actions/mainAction';

const defaultState = {
  email: '',
  password: '',
};

function informationReducer(state = defaultState, action) {
  switch (action.type) {
    case actions.MAIN_FORM_DATA_SAVED:
      return {
        email: action.email,
        password: action.password,
      };
    case actions.MAIN_FORM_DATA_RESET:
      return {
        email: '',
        password: '',
      };
    case actions.MAIN_JOIN_REQUESTED:
      return state;
    case actions.MAIN_JOIN_SUCCEEDED:
      return state;
    case actions.MAIN_JOIN_FAILED:
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  information: informationReducer,
});
