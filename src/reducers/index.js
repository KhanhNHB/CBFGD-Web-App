import { combineReducers } from 'redux';
import user from './users';
import shippers from './shippers';
import hub from './hub';
import providers from './providers';
import invoices from './invoices';

const appReducers = combineReducers({
        user,
        shippers,
        hub,
        providers,
        invoices,
});
export default appReducers;