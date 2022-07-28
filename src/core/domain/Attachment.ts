import { Exclude, Expose } from "class-transformer";

@Exclude()
export default class Attachment {
  @Expose()
  id: string;

  @Expose()
  original: string;

  @Expose()
  thumbnail: string;
}
