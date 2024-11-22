import { NextResponse } from 'next/server'; // For handling server responses in Next.js
import connectDB from '@/lib/mongodb'; // MongoDB connection utility to connect to the database
import Order from '@/models/order'; // Mongoose model for Order, representing the orders collection in MongoDB

// This function handles GET requests to fetch orders for a specific vendor
export async function GET(request: Request, { params }: { params: { vendorId: string } }) {
    // Destructuring vendorId from the request parameters
    const { vendorId } = params;

    // Check if vendorId is provided; if not, return an error response
    if (!vendorId) {
        return NextResponse.json({ success: false, error: 'Vendor ID is required' }, { status: 400 });
    }

    try {
        // Establish a connection to the MongoDB database
        await connectDB();

        // Query the Order collection to find orders that contain products from the specified vendor
        const orders = await Order.find({ 'products.vendorId': vendorId })
            // Populate the userId field with the user's email and name for more detailed information
            .populate('userId', 'email name')
            // Populate the productId field within products to include product name and price
            .populate('products.productId', 'name price')
            // Sort the orders by orderDate in descending order (most recent first)
            .sort({ orderDate: -1 });

        // Check if any orders were found; if not, return a not found response
        if (!orders || orders.length === 0) {
            return NextResponse.json({ success: false, error: 'No orders found for this vendor' }, { status: 404 });
        }

        // If orders are found, return a success response with the orders data
        return NextResponse.json({ success: true, data: orders });
    } catch (error: any) {
        // Log the error for debugging purposes
        console.error('Error fetching vendor orders:', error.message);
        // Return an internal server error response in case of an exception
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}