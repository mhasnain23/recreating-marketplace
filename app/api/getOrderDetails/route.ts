import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        await connectDB();

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch order" });
    }
}
