import * as types from '../constants/ActionTypes';

let initialState = {
    selectAssignOrderToShipperStatus: 'NONE',
}

const assignOrderToShipperStatus = (state = initialState, action) => {
    switch (action.type) {
        case types.CHANGE_ASSIGN_ORDER_TO_SHIPPER_STATUS:
            console.log(action.selectAssignOrderToShipperStatus);
            state.selectAssignOrderToShipperStatus = action.selectAssignOrderToShipperStatus;
            return { ...state };
        default: return { ...state };
    }
}
export default assignOrderToShipperStatus;