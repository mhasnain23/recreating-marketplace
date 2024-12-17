import { buffer } from 'micro';
import Stripe from 'stripe';
import Order from '@/models/order';
import connectToDB from '@/database/index';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig!, endpointSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        await connectToDB();

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const orderId = paymentIntent.metadata.orderId;

                try {
                    const order = await Order.findByIdAndUpdate(
                        orderId,
                        { paymentStatus: 'paid' },
                        { new: true }
                    );

                    if (!order) {
                        console.error('Order not found');
                    } else {
                        console.log('Order payment status updated via webhook:', order);
                    }
                } catch (err) {
                    console.error('Error updating order:', err);
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
    } else {
        res.status(200).json({ received: true });
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}