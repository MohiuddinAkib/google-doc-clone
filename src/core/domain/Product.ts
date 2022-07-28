import Attachment from "./Attachment";
import ProductType from "./ProductType";
import ProductCategory from "./ProductCategory";
import { ProductStatus } from "@constants/product";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export default class Product {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;
  @Expose()
  description: string;

  @Expose()
  type_id: number;

  @Expose()
  price: number;

  @Expose()
  sale_price?: number | null;

  @Expose()
  campaign_price: number;

  @Expose()
  sku: string;

  @Expose()
  quantity: number;

  @Expose()
  in_stock: number;

  @Expose()
  is_taxable: number;

  @Expose()
  shipping_class_id?: string;

  @Expose()
  status: ProductStatus;

  @Expose()
  unit: string;

  @Expose()
  height?: string | null;

  @Expose()
  width?: string | null;

  @Expose()
  length?: string | null;

  @Expose()
  @Type(() => Attachment)
  image: Attachment;

  @Expose()
  @Type(() => Attachment)
  gallery: Attachment[];

  @Expose()
  variants: { [k: string]: { quantity: number } };

  @Expose()
  deleted_at?: Date | null;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => ProductType)
  type: ProductType;

  @Expose()
  @Type(() => ProductCategory)
  categories: ProductCategory[];

  @Expose()
  variations: string[];
}
