import React from "react";
import { ObjectId } from "mongoose";
import startDb from "@/app/lib/db";
import OrderModel from "@/app/model/orderModel";
import ReviewModel from "@/app/model/reviewModel";
import RecentOrdersList, {
  RecentOrders,
} from "@/components/order/RecentOrdersList";
import RecentReviewsList, {
  RecentReviews,
} from "@/components/review/RecentReviewsList";

const fetchRecentOrders = async () => {
  await startDb();
  const orders = await OrderModel.find({ paymentStatus: "paid" })
    .sort("-createdAt")
    .limit(5);

  const result = orders.map((order): RecentOrders => {
    return {
      id: order._id.toString(),
      customerInfo: {
        name: order.shippingDetails.name,
      },
      products: order.orderItems,
    };
  });

  return JSON.stringify(result);
};

const fetchRecentReviews = async () => {
  await startDb();
  const reviews = await ReviewModel.find()
    .sort("-createdAt")
    .limit(10)
    .populate<{
      product: {
        _id: ObjectId;
        title: string;
        thumbnail: { url: string };
      };
    }>({
      path: "product",
      select: "title thumbnail.url",
    })
    .populate<{ userId: { name: string } }>({
      path: "userId",
      select: "name",
    });

  const result = reviews.map((review): RecentReviews => {
    return {
      id: review._id.toString(),
      date: review.createdAt.toString(),
      rating: review.rating,
      product: {
        id: review.product._id.toString(),
        title: review.product.title,
        thumbnail: review.product.thumbnail.url,
      },
      user: { name: review.userId.name },
    };
  });

  return JSON.stringify(result);
};

export default async function Dashboard() {
  const orders = JSON.parse(await fetchRecentOrders());
  const reviews = JSON.parse(await fetchRecentReviews());
  return (
    <div className="flex space-x-6">
      <RecentOrdersList orders={orders} />
      <RecentReviewsList reviews={reviews} />
    </div>
  );
}
