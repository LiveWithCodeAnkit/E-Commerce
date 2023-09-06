import * as Yup from "yup";
import { categories } from "@/components/constants/categories";

const fileValidator = (file: File) => {
  if (!file) return true;

  return file.size <= 1024 * 1024;
};

export const productSchema = Yup.object().shape({
  title: Yup.string().required("Title is required!"),
  description: Yup.string()
    .required("Description is required!")
    .max(2000, "Description must be at most 2000 characters"),
  bulletPoints: Yup.array().of(Yup.string()),
  mrp: Yup.number().required("MRP price is required!"),
  salePrice: Yup.number()
    .required("Sale price is required")
    .lessThan(Yup.ref("mrp"), "Sale price must be less than MRP"),
  category: Yup.string()
    .required("Category Must be reqquired")
    .oneOf(categories, "Invalid Category"),
  quantity: Yup.number().required("Quantity Required !"),
  thumbnail: Yup.mixed()
    .required("Thumbnail is required")
    .test("fileSize", "thumnails should be less than 1md", (file) =>
      fileValidator(file as File)
    ),
  images: Yup.array().of(
    Yup.mixed().test("fileSize", "images should be less than 1md", (file) =>
      fileValidator(file as File)
    )
  ),
});
