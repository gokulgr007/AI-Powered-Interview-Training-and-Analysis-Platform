import express from 'express';
import protect from '../middlewares/auth.js';
import { createCheckoutSession, createBillingPortalSession, stripeWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// create a checkout session (public - allow guest checkout by email)
router.post('/create-checkout-session', createCheckoutSession);

// create a billing portal session (protected)
router.post('/create-portal-session', protect, createBillingPortalSession);

// webhook (should be unprotected by signature)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
