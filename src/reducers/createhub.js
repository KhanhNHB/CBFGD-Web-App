import * as types from '../constants/ActionTypes';

let initialState = {
    name: '',
    radius: '',
}

const CreateHub = (state = initialState, action) => {
    switch (action.type) {
        case types.CREATE_HUB:
            state.name = action.hub;
            state.radius = action.hub
            return { ...state };
        default: return { ...state };
    }
}
export default CreateHub;