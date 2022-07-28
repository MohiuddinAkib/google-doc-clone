import HasTimestamps from "./HasTimestamps";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export default class ProductType extends HasTimestamps {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  icon: string | null;

  @Expose()
  image: string | null;
}
