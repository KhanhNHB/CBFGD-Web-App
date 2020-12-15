// API AWS
// export const BASE_URL = "http://18.141.214.35:8090";
// API Google
// export const BASE_URL = "http://34.126.70.182:8090";
export const BASE_URL = "http://localhost:8090";

export const LOGIN_ENDPOINT = `${BASE_URL}/auth/signin/admins`;
export const ADMIN_ENDPOINT = `${BASE_URL}/admins`;
export const CUSTOMER_ENDPOINT = `${BASE_URL}/customers`;
export const SHIPPER_ENDPOINT = `${BASE_URL}/shippers`;

export const HUB_ENDPOINT = `${BASE_URL}/hubs`;
export const HUB_MANAGER_ENDPOINT = `${BASE_URL}/hub-managers`;
export const INVOICE_ENDPOINT = `${BASE_URL}/invoices`;
export const PROVIDER_ENDPOINT = `${BASE_URL}/providers`;
export const PROFILE_ENDPOINT = `${BASE_URL}/auth/profile`;
export const DELIVERIES_STATUS_ENDPOINT = `${BASE_URL}/deliveries-status`;
// API Google
// export const BASE_URL_FABRIC = `http://34.126.123.79:4000`;
// API AWS
// export const BASE_URL_FABRIC = `http://54.255.239.112:4000`;
// API IPv.4
export const BASE_URL_FABRIC = `http://192.168.1.5:4000`;