import { combineReducers } from 'redux';
import user from './users';
import shippers from './shippers';
import hub from './hub';
import providers from './providers';
import invoice from './invoice';

const appReducers = combineReducers({
        user,
        shippers,
        hub,
        providers,
        invoice,
});
export default appReducers;