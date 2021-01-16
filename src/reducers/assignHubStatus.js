import * as types from '../constants/ActionTypes';

let initialState = {
    selectAssignHubStatus: 'NONE',
}

const assignHubStatus = (state = initialState, action) => {
    switch (action.type) {
        case types.CHANGE_ASSIGN_HUB_STATUS:
            state.selectAssignHubStatus = action.selectAssignHubStatus;
            return { ...state };
        default: return { ...state };
    }
}
export default assignHubStatus;