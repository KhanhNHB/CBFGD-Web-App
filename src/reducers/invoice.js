import * as types from '../constants/ActionTypes';

let initialState = {
    invoices: [],
    keyword: '',
    invoiceList: [],
}

const invoice = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_INVOICES:
            state.invoices = action.invoices;
            return { ...state };
        case types.CHANGE_KEYWORD:
            state.keyword = action.keyword;
            return { ...state };
        case types.LOAD_INVOICE_LIST:
            state.invoiceList = action.invoiceList;
            return { ...state };
        case types.LOAD_INVOICES_AVAILABLE:
            state.invoiceList = action.invoiceList;
            return { ...state };
        default: return { ...state };
    }
}
export default invoice;