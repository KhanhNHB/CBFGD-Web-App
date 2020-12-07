import * as types from '../constants/ActionTypes';

let initialState = {
    shippers: [],
}

const shipper = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_SHIPPER:
            state.shippers = action.shippers;
            return { ...state };
        default: return { ...state };
    }
}
export default shipper;