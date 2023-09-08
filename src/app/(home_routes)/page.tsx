import React from "react";
import startDb from "../lib/db";
import ProductModel from "../model/productModel";
import GridView from "@/components/sales/GridView";
import FeaturedProductsSlider from "@/components/featured/FeaturedProductsSlider";
import FeaturedProductModel from "../model/featuredProduct";
import ProductCard from "@/components/products/ProductCard";
import CategoryMenu from "@/components/categories/CategoryMenu";

interface LatestProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: {
    base: number;
    discounted: number;
  };
  sale: number;
}

const fetchLatestProducts = async () => {
  await startDb();
  const products = await ProductModel.find().sort("-createdAt").limit(20);

  const productList = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
      rating: product.rating,
    };
  });

  return JSON.stringify(productList);
};

const fetchFeaturedProducts = async () => {
  await startDb();
  const products = await FeaturedProductModel.find().sort("-createdAt");

  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      banner: product.banner.url,
      link: product.link,
      linkTitle: product.linkTitle,
    };
  });
};

export default async function Home() {
  const latestProducts = await fetchLatestProducts();
  const parsedProducts = JSON.parse(latestProducts) as LatestProduct[];
  const featuredProducts = await fetchFeaturedProducts();

  return (
    // <div className="py-4 space-y-4">
    <div className="max-w-screen-xl mx-auto p-4 space-y-10 py-8">
      {/* <div className="flex flex-col justify-center gap-10 w-auto  "> */}
      <FeaturedProductsSlider products={featuredProducts} />
      <CategoryMenu />
      <GridView>
        {parsedProducts.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </GridView>
    </div>
  );
}
