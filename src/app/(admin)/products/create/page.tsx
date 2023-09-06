"use client";
import { ValidationError } from "yup";
import { useRouter } from "next/navigation";
import { useToastMessages } from "@/components/message/useToastMessages";
import ProductForm from "@/components/products/ProductForm";
import { uploadImage } from "@/components/products/helper/helper";
import { productSchema } from "@/components/products/schema/productSchema";
import { NewProductInfo } from "@/components/types";
import { createProduct } from "../action";

const Create = () => {
  const { Success, Warn } = useToastMessages();
  const router = useRouter();
  const handleCreateProduct = async (values: NewProductInfo) => {
    try {
      const { thumbnail, images } = values;
      await productSchema.validate(values, { abortEarly: false });
      const thumbnailRes = await uploadImage(thumbnail!);

      let productImages: { url: string; id: string }[] = [];
      if (images) {
        const uploadPromise = images.map(async (imageFile) => {
          const { id, url } = await uploadImage(imageFile);
          return { id, url };
        });

        productImages = await Promise.all(uploadPromise);
      }

      await createProduct({
        ...values,
        price: {
          base: values.mrp,
          discounted: values.salePrice,
        },
        thumbnail: thumbnailRes,
        images: productImages,
      });
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
    <>
      <ProductForm onSubmit={handleCreateProduct} />
    </>
  );
};

export default Create;
