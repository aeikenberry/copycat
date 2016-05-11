import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import history from './history';

const rootReducer = combineReducers({
  history,
  routing
});

export default rootReducer;
