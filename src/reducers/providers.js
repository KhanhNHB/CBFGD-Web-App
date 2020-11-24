import * as types from '../constants/ActionTypes';

let initialState = {
    providers: [],
}

const prividers = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_PROVIDER:
            state.providers = action.providers;
            return { ...state };
        default: return { ...state };
    }
}
export default prividers;