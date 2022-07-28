import dayjs from "dayjs";
import { Expose, Transform, Type } from "class-transformer";

export default class HasTimestamps {
  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => dayjs(value), { toClassOnly: true })
  created_at: dayjs.Dayjs;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => (!!value ? dayjs(value) : null), {
    toClassOnly: true,
  })
  updated_at: dayjs.Dayjs | null;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => (!!value ? dayjs(value) : null), {
    toClassOnly: true,
  })
  deleted_at?: dayjs.Dayjs | null;
}
