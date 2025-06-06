import Stripe from 'stripe';
import { logger } from '../utils/logger';
class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2023-10-16',
        });
    }
    static getInstance() {
        if (!StripeService.instance) {
            StripeService.instance = new StripeService();
        }
        return StripeService.instance;
    }
    async createPaymentIntent(amount, currency = 'ngn') {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency,
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            return paymentIntent;
        }
        catch (error) {
            logger.error('Error creating payment intent:', error);
            throw error;
        }
    }
    async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        }
        catch (error) {
            logger.error('Error confirming payment:', error);
            throw error;
        }
    }
    async createCheckoutSession(params) {
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: params.currency,
                            product_data: {
                                name: 'NITP Payment',
                            },
                            unit_amount: Math.round(params.amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: params.successUrl,
                cancel_url: params.cancelUrl,
                customer_email: params.customerEmail,
                metadata: params.metadata,
            });
            return session;
        }
        catch (error) {
            logger.error('Error creating checkout session:', error);
            throw error;
        }
    }
}
export const stripeService = StripeService.getInstance();
