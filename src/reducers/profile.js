import * as types from '../constants/ActionTypes';

let initialState = {
    profile: null
}

const profile = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_PROFILE:
            state.profile = action.profile;
            return { ...state };
        default:
            return { ...state };
    }
}
export default profile;