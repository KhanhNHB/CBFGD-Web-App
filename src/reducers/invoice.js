import * as types from '../constants/ActionTypes';

let initialState = {
    listInvoice: [],
}

const invoices = (state = initialState, action) => {
    switch (action.type) {
        case types.INVOICES:
            state.listInvoice = action.invoices;
            return { ...state };
        default: return { ...state };
    }
}
export default invoices;