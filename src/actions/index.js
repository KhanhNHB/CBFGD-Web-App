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

export const actGetListInvoice = (invoices) => {
    return {
        type: types.INVOICES,
        invoices,
    }
}