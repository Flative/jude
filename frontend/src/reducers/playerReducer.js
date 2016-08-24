import * as actions from '../actions/playerAction';

const defaultState = {
  instance: null,
  isPaused: true,
  isFetching: true,
};

export default function playerReducer(state = defaultState, action) {
  switch(action.type) {
    case actions.PLAYER_INITIALIZED:
      return { ...state,
        instance: action.instance,
      };
    case actions.PLAYER_PLAYED:
      return { ...state,
        isPaused: false,
      };
    case actions.PLAYER_PAUSED:
      return { ...state,
        isPaused: true,
      };
    case actions.PLAYER_FETCHING_STARTED:
      return { ...state,
        isFetching: true,
      };
    case actions.PLAYER_FETCHING_FINISHED:
      return { ...state,
        isFetching: false,
      };
    default:
      return state;
  }
}
