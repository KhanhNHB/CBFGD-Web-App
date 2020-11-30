import * as types from '../constants/ActionTypes';

let initialState = {
    providers: [],
    provider_name: 'NONE'
}

const prividers = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_PROVIDER:
            state.providers = action.providers;
            return { ...state };
        case types.LOAD_PROVIDER_NAME:
            state.provider_name = action.provider_name;
            return { ...state };
        default: return { ...state };
    }
}
export default prividers;