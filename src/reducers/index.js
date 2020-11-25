import { combineReducers } from 'redux';
import user from './users';
import shippers from './shippers';
import hub from './hub';
import providers from './providers';
import invoice from './invoice';
import profile from './profile';

const appReducers = combineReducers({
        user,
        shippers,
        hub,
        providers,
        invoice,
        profile,
});
export default appReducers;