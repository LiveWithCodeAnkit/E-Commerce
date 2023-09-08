"use client";
import React from "react";
import { ValidationError } from "yup";
import { useRouter } from "next/navigation";
import ProductForm, { InitialValue } from "./ProductForm";
import { NewProductInfo, ProductResponse, ProductToUpdate } from "../types";
import {
  removeAndUpdateProductImage,
  removeImageFromCloud,
  updateProduct,
} from "@/app/(admin)/products/action";
import { extractPublicId, uploadImage } from "./helper/helper";
import { updateProductInfoSchema } from "./schema/validationSchema";
import { useToastMessages } from "../message/useToastMessages";

interface Props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: Props) {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();
  const initialValue: InitialValue = {
    ...product,
    thumbnail: product.thumbnail.url,
    images: product.images?.map(({ url }) => url),
    mrp: product.price.base,
    salePrice: product.price.discounted,
    bulletPoints: product.bulletPoints || [],
  };

  const handleImageRemove = (source: string) => {
    const publicId = extractPublicId(source);

    removeAndUpdateProductImage(product.id, publicId);
  };

  const handleOnSubmit = async (values: NewProductInfo) => {
    try {
      const { thumbnail, images } = values;
      await updateProductInfoSchema.validate(values, { abortEarly: false });

      const dataToUpdate: ProductToUpdate = {
        title: values.title,
        description: values.description,
        bulletPoints: values.bulletPoints,
        category: values.category,
        quantity: values.quantity,
        price: {
          base: values.mrp,
          discounted: values.salePrice,
        },
      };

      if (thumbnail) {
        await removeImageFromCloud(product.thumbnail.id);
        const { id, url } = await uploadImage(thumbnail);
        dataToUpdate.thumbnail = { id, url };
      }

      if (images.length) {
        const uploadPromise = images.map(async (imgFile) => {
          return await uploadImage(imgFile);
        });
        dataToUpdate.images = await Promise.all(uploadPromise);
      }

      // update our product
      await updateProduct(product.id, dataToUpdate);
      Success("Product Updated");
      router.refresh();
      router.push("/products");
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          Warn(err.message);
        });
      }
    }
  };

  return (
    <ProductForm
      onImageRemove={handleImageRemove}
      initialValue={initialValue}
      onSubmit={handleOnSubmit}
    />
  );
}
