import HasTimestamps from "./HasTimestamps";
import { Exclude, Expose, Type } from "class-transformer";
import Attachment from "./Attachment";

@Exclude()
export default class ProductCategory extends HasTimestamps {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  icon: string | null;

  @Expose()
  @Type(() => Attachment)
  image: Attachment[];

  @Expose()
  details: string | null;

  @Expose()
  parent: number | null;

  @Expose()
  type_id: number;
}
