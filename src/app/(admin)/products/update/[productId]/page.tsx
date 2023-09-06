import React from "react";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/model/productModel";
import { ProductResponse } from "@/components/types";
import UpdateProduct from "@/components/products/UpdateProduct";

interface Props {
  params: {
    productId: string;
  };
}

const fetchProductInfo = async (productId: string): Promise<string> => {
  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  const finalProduct: ProductResponse = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    quantity: product.quantity,
    price: product.price,
    bulletPoints: product.bulletPoints,
    images: product.images?.map(({ url, id }) => ({ url, id })),
    thumbnail: product.thumbnail,
    category: product.category,
  };

  return JSON.stringify(finalProduct);
};

export default async function UpdatePage(props: Props) {
  const { productId } = props.params;
  const product = await fetchProductInfo(productId);

  return <UpdateProduct product={JSON.parse(product)} />;
}
