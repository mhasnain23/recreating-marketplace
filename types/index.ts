import { Types } from "mongoose";

export interface Product {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    productImage: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductResponse {
    success: boolean;
    data?: Product[];
    message?: string;
    error?: string;
}

export interface UserInfo {
    success: boolean;
    data?: {
        _id: string;
        userName: string;
        email: string;
        role: "vendor" | "buyer";
    };
    message?: string;
}

// types/order.ts

export interface Product {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface Order {
    _id: Types.ObjectId;
    userId: {
        _id: Types.ObjectId;
        name: string;
        email: string;
    };
    products: {
        productId: {
            _id: Types.ObjectId;
            name: string;
        };
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    stripeSessionId: string;
    paymentStatus: "pending" | "completed" | "failed";
    shippingAddress: string;
    orderDate: Date;
}
