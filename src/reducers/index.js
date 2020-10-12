import {combineReducers} from 'redux';
import user from './users';

const appReducers = combineReducers({
        user,
});
export default appReducers;