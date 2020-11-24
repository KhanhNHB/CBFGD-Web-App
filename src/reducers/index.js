import { combineReducers } from 'redux';
import user from './users';
import shippers from './shippers';
import hub from './hub';
import invoice from './invoice';

const appReducers = combineReducers({
        user,
        shippers,
        hub,
        invoice
});
export default appReducers;