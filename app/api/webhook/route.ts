import { NextResponse } from 'next/server'; // For handling server-side responses
import { headers } from 'next/headers'; // For accessing request headers
import { handleStripeWebhook } from '@/actions'; // Custom handler for specific webhook events
import { buffer } from 'micro'; // For raw body handling

// Stripe secret keys from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

// Stripe instance initialization
const stripe = require('stripe')(stripeSecretKey);

// Disable Next.js body parsing to handle raw body required for Stripe signature
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Read raw body from the request
        const rawBody = await buffer(req);
        // Extract Stripe signature from the headers
        const signature = req.headers['stripe-signature'];

        // Verify and construct the Stripe event
        const event = stripe.webhooks.constructEvent(rawBody.toString(), signature, webhookSecret);

        // Handle the Stripe event (custom handler logic in `handleStripeWebhook`)
        const result = await handleStripeWebhook(event);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        // Acknowledge receipt of the event
        res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error.message || error);
        res.status(400).json({ error: 'Webhook handler failed' });
    }
}