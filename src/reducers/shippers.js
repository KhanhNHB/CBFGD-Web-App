import * as types from '../constants/ActionTypes';

let initialState = {
    listShippers: [],
}

const shippers = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_SHIPPERS:
            state.listShippers = action.shippers;
            return { ...state };
        case types.CREATE_SUCCESSFULLY:
            state.listShippers = state.listShippers.concat([action.shipper]);
            return { ...state }
        default: return { ...state };
    }
}
export default shippers;