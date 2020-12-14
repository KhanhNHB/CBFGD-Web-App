import * as types from '../constants/ActionTypes';

let initialState = {
    listHubManager: [],
}

const hubmanager = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_HUB_MANAGER:
            state.listHubManager = action.hubmanger;
            return { ...state };
        default: return { ...state };
    }
}
export default hubmanager;