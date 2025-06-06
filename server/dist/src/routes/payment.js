import express from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth';
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
// Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
    try {
        const { amount, currency = 'ngn' } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).json({ message: err.message });
    }
});
// Confirm payment
router.post('/confirm', authenticateToken, async (req, res) => {
    try {
        const { paymentIntentId, clientSecret } = req.body;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.client_secret !== clientSecret) {
            throw new Error('Invalid payment confirmation');
        }
        if (paymentIntent.status !== 'succeeded') {
            throw new Error('Payment not successful');
        }
        // Update the relevant record in your database
        // This could be a membership, application, or renewal
        // The specific update will depend on the context of the payment
        res.json({ message: 'Payment confirmed successfully' });
    }
    catch (err) {
        console.error('Error confirming payment:', err);
        res.status(500).json({ message: err.message });
    }
});
export default router;
