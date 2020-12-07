export const GENDER = {
    FEMALE: "Female",
    MALE: "Male"
}

export const USER_TOKEN = 'USER_TOKEN';
export const ACCESS_TOKEN_FABRIC = 'ACCESS_TOKEN_FABRIC';

export const ROLE = {
    CUSTOMER: 'Customer',
    SHIPPER: 'Shipper',
    ADMIN: 'Admin'
}

export const STATUS = {
    PENDING: "Pending",
    AVAILABLE: "Available",
    TERMINAL: "Terminal"
}

export const INVOICE_STATUS = {
    ACTIVE: 'ACTIVE',
    DEACTIVE: 'DEACTIVE'
}

export const INVOICE_PRIORITY = {
    STANDARD: 'Standard',
    EXPRESS: 'Express'
}

export const DELIVERY_STATUS = {
    // hàng vẫn trong kho
    IN_WAREHOUSE: 'IN_WAREHOUSE',
    // Đơn hàng cần ship của shipper
    TO_DELIVERY: 'TO_DELIVERY',
    // shipper đang giao đơn của mình
    DELIVERING: 'DELIVERING',
    //hoàn thành
    COMPLETED: 'COMPLETED',
    // chưa giao được, sẽ giao sau hoặc khách báo giao sau   
    CANCELLED: 'CANCELLED',
    // hoàn trả- sau 3 lần cancelled
    RETURN_REFUND: 'REFUND',
}

export const GENDER_ITEMS = [
    { id: 'Male', title: 'Male' },
    { id: 'Female', title: 'Female' },
    { id: '', title: 'Other' },
]