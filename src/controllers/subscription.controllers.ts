import { AppError } from "../utils/appError.js";
import { successResponse } from "../utils/successResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { NextFunction, Request, Response } from "express";
import { stripe } from "../services/stripe.js";
import { absoluteUrl } from "../utils/absoluteUrl.js";
import { User } from "../models/user.models.js";
import { envConfig } from "../config/envConfig.js";
import type Stripe from "stripe";

const createSubscriptionSession = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dashboardUrl = absoluteUrl('/dashboard');

  const { sub } = (req as any).user;
  try {
    const user = await User.findById(sub);

    if (!user) {
      throw new AppError('No user found!', 404);
    }

    let customerId = user?.stripeCustomerId || null;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: sub }
      });

      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    if (user.isSubscribed && user.subscriptionStatus === 'active') {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: dashboardUrl,
      });

      return res.status(200).json(successResponse('Billing Portal.', 200, { data: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "One Trip Pro",
              description: "Unlimited Trips.",
            },
            unit_amount: 20000,
            recurring: {
              interval: "month",
            }
          },
          quantity: 1
        },
      ],
      success_url: dashboardUrl,
      cancel_url: dashboardUrl,
      metadata: {
        userId: customerId
      }
    });

    res.status(200).json(successResponse('Billing Portal.', 200, { data: stripeSession.url }));

  } catch (error) {
    console.log('Subscription session error', error);
    throw new AppError('Subscription session Error', 500);
  }
});

const getSubscriptionDetails = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sub } = (req as any).user;

  try {
    const user = await User.findById(sub);

    let subscriptionDetails = null;

    if (user?.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      subscriptionDetails = subscription;
    }

    res.status(200).json(successResponse('User subscription details.', 200, { data: subscriptionDetails }));
  } catch (error) {
    console.log('Get subscription details error :: ', error);
    throw new AppError('Get subscription details error', 500);
  }
});

const webhook = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret: string = envConfig.webhookSecret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret,
    );
  } catch (error) {
    console.log('Webhook error', error);
    throw new AppError('Webhook error!', 500);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      throw new AppError('userID is required!', 404);
    }

    await User.findByIdAndUpdate(
      { stripeCustomerId: subscription.customer as string },
      {
        $set: {
          isSubscribed: true,
          availableFreeLimit: 0,
          subscriptionStatus: "active",
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
        }
      }
    );
  };

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await User.findByIdAndUpdate(
      { stripeCustomerId: subscription.customer as string },
      {
        $set: {
          isSubscribed: true,
          availableFreeLimit: 0,
          subscriptionStatus: "active",
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
        }
      }
    );
  };

  res.status(200).json(successResponse('Webhook success.', 200));
});

export {
  createSubscriptionSession,
  getSubscriptionDetails,
  webhook,
};