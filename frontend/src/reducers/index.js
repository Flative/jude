import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import main from './mainReducer';

const reducer = combineReducers({
  main,
  routing: routerReducer,
});

export default reducer;
