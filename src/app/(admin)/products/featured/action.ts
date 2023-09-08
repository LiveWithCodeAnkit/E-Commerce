"use server";
import startDb from "@/app/lib/db";
import {
  FeaturedProductForUpdate,
  NewFeaturedProduct,
} from "@/components/types";
import { removeImageFromCloud } from "../action";
import FeaturedProductModel from "@/app/model/featuredProduct";

export const createFeaturedProduct = async (info: NewFeaturedProduct) => {
  try {
    await startDb();
    await FeaturedProductModel.create({ ...info });
  } catch (error) {
    throw error;
  }
};

export const updateFeaturedProduct = async (
  id: string,
  info: FeaturedProductForUpdate
) => {
  try {
    await startDb();
    await FeaturedProductModel.findByIdAndUpdate(id, { ...info });
  } catch (error) {
    throw error;
  }
};

export const deleteFeaturedProduct = async (id: string) => {
  try {
    await startDb();
    const product = await FeaturedProductModel.findByIdAndDelete(id);
    if (product) {
      await removeImageFromCloud(product.banner.id);
    }
  } catch (error) {
    throw error;
  }
};
