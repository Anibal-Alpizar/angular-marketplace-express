export interface PurchaseItem {
    productId: number;
    Quantity: number;
    Subtotal: number;
}

export interface confirmOrderRequest {
    userId: number;
    paymentMethod: number;
    totalAmount: number;
    taxAmount: number;
    addressId: number;
    PurchaseItems: PurchaseItem[];
}
