import React from "react";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/model/featuredProduct";
import FeaturedProductForm from "@/components/featured/FeaturedProductForm";

interface Props {
  searchParams: { id: string };
}

const fetchFeaturedProduct = async (id: string) => {
  if (!isValidObjectId(id)) return redirect("/404");

  await startDb();
  const product = await FeaturedProductModel.findById(id);
  if (!product) return redirect("/404");

  const { _id, title, banner, link, linkTitle } = product;

  return {
    id: _id.toString(),
    title,
    banner: banner.url,
    link,
    linkTitle,
  };
};

export default async function UpdateFeaturedProduct({ searchParams }: Props) {
  const { id } = searchParams;
  const product = await fetchFeaturedProduct(id);

  return <FeaturedProductForm initialValue={product} />;
}
