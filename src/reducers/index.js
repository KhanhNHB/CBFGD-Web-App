import { combineReducers } from 'redux';
import user from './users';
import shippers from './shippers';
import hub from './hub';
import providers from './providers';
import invoice from './invoice';
import profile from './profile';
import CreateHub from './createhub';
import shipper from './shipper';
import hubmanager from './hubmanager';
import assignHubStatus from './assignHubStatus';
const appReducers = combineReducers({
        user,
        shippers,
        hub,
        providers,
        invoice,
        profile,
        CreateHub,
        shipper,
        hubmanager,
        assignHubStatus
});
export default appReducers;