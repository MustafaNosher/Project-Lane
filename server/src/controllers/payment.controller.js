import User from "../models/user.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

// Ensure key is present
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * CREATE CHECKOUT SESSION (SUBSCRIPTION)
 */
export const createCheckOutSession = async (req, res) => {
  try {
    const { successUrl, cancelUrl } = req.body;
    const userId = req.user._id; 

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        message: "successUrl and cancelUrl are required",
      });
    }

    const user = await User.findById(userId);
    
    let customerId = user.stripeCustomerId;

    const sessionParams = {
      payment_method_types: ["card"],
      mode: "subscription", 
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Plan – Project Management App",
              description: "Unlock premium project management features",
            },
            unit_amount: 1000, // $10
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId.toString(),
      },
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else {
        sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * CREATE CUSTOMER PORTAL SESSION
 */
export const createCustomerPortal = async (req, res) => {
    try {
        const userId = req.user._id;
        const { returnUrl } = req.body; 

        const user = await User.findById(userId);

        if (!user.stripeCustomerId) {
            return res.status(400).json({
                success: false,
                message: "No subscription found to manage.",
            });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: returnUrl || process.env.CLIENT_URL || "http://localhost:3000", // Fallback
        });

        return res.status(200).json({
            success: true,
            url: portalSession.url,
        });

    } catch (error) {
        console.error("Create Portal Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to create portal session",
        });
    }
};

/**
 * GET CHECKOUT SESSION DETAILS
 */
export const getCheckoutSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get Checkout Session Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve checkout session",
    });
  }
};

/**
 * STRIPE WEBHOOK
 */
export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId && customerId) {
          await User.findByIdAndUpdate(userId, {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId, 
            plan: "pro",
            isPaid: true,
            stripeSessionId: session.id, 
          });
          console.log(`User ${userId} upgraded to Pro.`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          const customerId = invoice.customer;
          await User.findOneAndUpdate({ stripeCustomerId: customerId }, {
              isPaid: true,
              plan: "pro" 
          });
          break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        console.log(`Invoice payment failed for customer ${customerId}`);
        break;
      }

      case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = subscription.customer;

          await User.findOneAndUpdate({ stripeCustomerId: customerId }, {
              plan: "free",
              isPaid: false,
              stripeSubscriptionId: null,
          });
          console.log(`Subscription deleted for customer ${customerId}, downgraded to free.`);
          break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error.message);
    return res.status(500).json({ error: "Webhook handler failed" });
  }
};
