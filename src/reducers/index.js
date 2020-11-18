import {combineReducers} from 'redux';
import user from './users';
import shippers from './shippers';
import hub from './hub';
const appReducers = combineReducers({
        user,
        shippers,
        hub,
});
export default appReducers;