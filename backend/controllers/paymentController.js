import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).send({ error: error.message });
    }
};
