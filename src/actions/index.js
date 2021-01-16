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
export const actCreateHub = (hub) => {
    return {
        type: types.CREATE_HUB,
        hub,
    }
};
export const actLoadProvider = (providers) => {
    return {
        type: types.LOAD_PROVIDER,
        providers,
    }
};

export const actLoadProviderName = (provider_name) => {
    return {
        type: types.LOAD_PROVIDER_NAME,
        provider_name,
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

export const actLoadProfile = (profile) => {
    return {
        type: types.LOAD_PROFILE,
        profile
    }
};

export const actLoadShipper = (shippers) => {
    return {
        type: types.LOAD_SHIPPER,
        shippers,
    }
};

export const actLoadHubManager = (hubmanger) => {
    return {
        type: types.LOAD_HUB_MANAGER,
        hubmanger,
    }
};

export const actLoadAssignHubStatus = (selectAssignHubStatus) => {
    return {
        type: types.CHANGE_ASSIGN_HUB_STATUS,
        selectAssignHubStatus,
    }
};

export const actLoadAssignOrderToShipperStatus = (selectAssignOrderToShipperStatus) => {
    return {
        type: types.CHANGE_ASSIGN_ORDER_TO_SHIPPER_STATUS,
        selectAssignOrderToShipperStatus,
    }
};
