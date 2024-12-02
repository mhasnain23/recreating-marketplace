"use server";


import { NextResponse } from "next/server";
import connectDB from "@/database/mongodb"; // Replace with your actual DB connection
import Order from "@/lib/models/order";
import { NextApiRequest } from "next";

export async function POST(req: NextApiRequest) {
    try {
        await connectDB();

        const { orderId, paymentStatus } = req.body;

        if (!orderId || !paymentStatus) {
            return NextResponse.json(
                { success: false, message: "Order ID and payment status are required." },
                { status: 400 }
            );
        }

        // Update the order in the database (adjust for your DB schema)
        const updatedOrder = await Order.findByIdAndUpdate(
            { _id: orderId }, // Find the order by ID
            { $set: { paymentStatus } } // Update the payment status
        );

        if (updatedOrder.modifiedCount > 0) {
            return NextResponse.json({ success: true, message: "Status updated successfully." });
        } else {
            return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
        }
    } catch (error) {
        console.error("Error updating status:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
