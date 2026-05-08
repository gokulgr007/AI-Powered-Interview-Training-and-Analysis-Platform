import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// mapping: plan name -> price id env var
const priceForPlan = (planName) => {
  if (!planName) return null;
  if (planName.toLowerCase() === 'pro') return process.env.STRIPE_PRICE_PRO;
  if (planName.toLowerCase() === 'free') return null;
  return null;
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan, email } = req.body || {};
    const priceId = priceForPlan(plan);
    if (!priceId) return res.status(400).json({ message: 'Invalid plan or no price configured' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: `${FRONTEND_ORIGIN}/?checkout=success`,
      cancel_url: `${FRONTEND_ORIGIN}/?checkout=cancel`
    });

    return res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('createCheckoutSession err', err);
    return res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

export const createBillingPortalSession = async (req, res) => {
  try {
    const { email } = req.body || {};
    // find or create customer by email
    let customer = null;
    if (email) {
      const list = await stripe.customers.list({ email, limit: 1 });
      if (list.data && list.data.length) customer = list.data[0];
    }
    if (!customer) {
      if (!email) return res.status(400).json({ message: 'Email required to create customer' });
      customer = await stripe.customers.create({ email });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: FRONTEND_ORIGIN
    });

    return res.json({ url: portalSession.url });
  } catch (err) {
    console.error('createBillingPortalSession err', err);
    return res.status(500).json({ message: 'Failed to create billing portal session' });
  }
};

// Optional: a minimal webhook endpoint to log subscription events
export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event = null;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
    console.log('[stripe webhook] event type:', event.type);
    // handle subscription events as needed
    return res.json({ received: true });
  } catch (err) {
    console.error('stripeWebhook err', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
