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