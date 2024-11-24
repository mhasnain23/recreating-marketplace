import connectToDB from '@/lib/mongodb';
import Order from '@/models/order';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Ensure database connection
        await connectToDB();

        const { orderId, newStatus } = req.body;

        // Validate input
        if (!orderId || !newStatus) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        try {
            const order = await Order.findByIdAndUpdate(
                orderId,
                { paymentStatus: newStatus },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            return res.status(200).json({ success: true, order });
        } catch (error) {
            console.error('Error updating order:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']); // Allow only POST
        return res.status(405).end('Method Not Allowed');
    }
}