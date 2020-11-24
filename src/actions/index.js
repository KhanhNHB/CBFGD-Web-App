import * as types from '../constants/ActionTypes';

export const actSignIn = (userToken) => {
    return {
        type: types.SIGN_IN,
        userToken,
    };
};

export const actGetAllShipper = (shippers) => {
    return {
        type: types.GET_ALL_SHIPPERS,
        shippers,
    }
};

export const actCreateShipper = (shipper) => {
    return {
        type: types.CREATE_SUCCESSFULLY,
        shipper,
    }
};

export const actGetListHub = (listHubs) => {
    return {
        type: types.LIST_HUB,
        listHubs,
    }
};

export const actLoadProvider = (providers) => {
    return {
        type: types.LOAD_PROVIDER,
        providers,
    }
};

export const actLoadInvoices = (invoices) => {
    return {
        type: types.LOAD_INVOICES,
        invoices,
    }
};

export const actChangeKeyword = (keyword) => {
    return {
        type: types.CHANGE_KEYWORD,
        keyword,
    }
};

export const actLoadInvoiceList = (invoiceList) => {
    return {
        type: types.LOAD_INVOICE_LIST,
        invoiceList,
    }
};
