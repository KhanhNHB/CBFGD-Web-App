import * as types from '../constants/ActionTypes';

let initialState = {
    invoices: [],
    keyword: '',
}

const invoices = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_INVOICES:
            state.invoices = action.invoices;
            return { ...state };
        case types.CHANGE_KEYWORD:
            state.keyword = action.keyword;
            return { ...state };
        default: return { ...state };
    }
}
export default invoices;