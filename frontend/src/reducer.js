import outcome from './reducers/outcome';
import query from './reducers/query';
import state from './reducers/state';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    outcome,
    query,
    state,
    router: routerReducer
});