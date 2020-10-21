import {combineReducers} from 'redux';
import user from './users';
import shippers from './shippers';

const appReducers = combineReducers({
        user,
        shippers,
        
});
export default appReducers;