import { Document, Schema, models, model, Model } from "mongoose";
import { categories } from "@/components/constants/categories";

interface ProductDocument extends Document {
  title: string;
  description: string;
  bulletpoints?: string[];
  thumbnail: { url: string; id: string };
  images?: { url: string; id: string }[];
  price: {
    base: number;
    discounted: number;
  };

  category: string;

  sale: number;
}

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bulletpoints: { type: [String] },
    thumbnail: {
      type: Object,
      required: true,
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    price: {
      base: { type: Number, required: true },
      discounted: { type: Number, required: true },
    },
    category: { type: String, enum: [...categories], required: true },
  },
  { timestamps: true }
);

productSchema.virtual("sale").get(function (this: ProductDocument) {
  return (this.price.base - this.price.discounted) / this.price.base;
});

const ProductModel =
  models.Product || model<ProductDocument>("Product", productSchema);

export default ProductModel as Model<ProductDocument>;
/*
this is the interface for mongoose model that i want
to create 


interface ProductDocument extends Document {
  title: string;
  description: string;
  bulletpoints?: string[];
  thumbnail: { url: string; id: string };
  images?: { url: string; id: string }[];
  price: {
    base: number;
    discount: number;
  };
  sale: number;
  quantity: number;
  category: string;
}



the sale field is going to be virtual so calculate this field using


the price.base and the discounted the base price is the
mrp of the product also use typeScript to create this model nd while exporting the model first check inside models product and only
if it is not there create the new model
*/
