import Stripe from "stripe";
import { getCartItems } from "@/app/lib/cartHelper";
import CartModel from "@/app/model/cartModel";
import OrderModel from "@/app/model/orderModel";
import ProductModel from "@/app/model/productModel";

import { CartProduct, StripeCustomer } from "@/components/types";

import { NextResponse } from "next/server";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-08-16",
});

export const POST = async (req: Request) => {
  const data = await req.text();

  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      data,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      {
        status: 400,
      }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const stripeSession = event.data.object as {
        customer: string;
        payment_intent: string;
        amount_subtotal: number;
        customer_details: any;
        payment_status: string;
      };

      const customer = (await stripe.customers.retrieve(
        stripeSession.customer
      )) as unknown as StripeCustomer;

      const { cartId, userId, type, product } = customer.metadata;
      // create new order
      if (type === "checkout") {
        const cartItems = await getCartItems(userId, cartId);
        await OrderModel.create({
          userId,
          stripeCustomerId: stripeSession.customer,
          paymentIntent: stripeSession.payment_intent,
          totalAmount: stripeSession.amount_subtotal / 100,
          shippingDetails: {
            address: stripeSession.customer_details.address,
            email: stripeSession.customer_details.email,
            name: stripeSession.customer_details.name,
          },
          paymentStatus: stripeSession.payment_status,
          deliveryStatus: "ordered",
          orderItems: cartItems.products,
        });

        // recount our stock
        const updateProductPromises = cartItems.products.map(
          async (product) => {
            return await ProductModel.findByIdAndUpdate(product.id, {
              $inc: { quantity: -product.qty },
            });
          }
        );

        await Promise.all(updateProductPromises);

        // remove the cart
        await CartModel.findByIdAndDelete(cartId);
      }

      if (type === "instant-checkout") {
        const productInfo = JSON.parse(product) as unknown as CartProduct;
        await OrderModel.create({
          userId,
          stripeCustomerId: stripeSession.customer,
          paymentIntent: stripeSession.payment_intent,
          totalAmount: stripeSession.amount_subtotal / 100,
          shippingDetails: {
            address: stripeSession.customer_details.address,
            email: stripeSession.customer_details.email,
            name: stripeSession.customer_details.name,
          },
          paymentStatus: stripeSession.payment_status,
          deliveryStatus: "ordered",
          orderItems: [{ ...productInfo }],
        });

        // recount our stock
        await ProductModel.findByIdAndUpdate(productInfo.id, {
          $inc: { quantity: -1 },
        });
      }
    }

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong, can not create order!" },
      { status: 500 }
    );
  }
};
