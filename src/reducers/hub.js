import * as types from '../constants/ActionTypes';

let initialState = {
    listHub: [],
}

const hub = (state = initialState, action) => {
    switch (action.type) {
        case types.LIST_HUB:
            state.listHub = action.listHubs;
            return { ...state };
        default: return { ...state };
    }
}
export default hub;