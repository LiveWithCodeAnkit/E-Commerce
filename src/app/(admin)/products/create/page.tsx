"use client";
// import ProductForm from "@/components/admin/product/ProdecutForm";
// import { uploadImage } from "@/components/admin/product/helper/helper";
// import { productSchema } from "@/components/admin/product/schema/productSchema";
import { ValidationError } from "yup";
import { useToastMessages } from "@/components/message/useToastMessages";
import ProductForm from "@/components/products/ProductForm";
import { uploadImage } from "@/components/products/helper/helper";
import { productSchema } from "@/components/products/schema/productSchema";
import { NewProductInfo } from "@/components/types";

const Create = () => {
  const { Success, Warn } = useToastMessages();
  const handleCreateProject = async (values: NewProductInfo) => {
    try {
    //   await productSchema.validate(values, { abortEarly: false });
         await uploadImage(values.thumbnail!)
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
      <ProductForm onSubmit={handleCreateProject} />
    </>
  );
};

export default Create;
