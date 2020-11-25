import * as types from '../constants/ActionTypes';

let initialState = {
    isLoading: true,
    userToken: null,
    isSignOut: false,
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case types.SIGN_IN:
            state.isSignOut = false;
            state.userToken = action.userToken;
            return { ...state };
        default: return { ...state };
    }
}
export default user;