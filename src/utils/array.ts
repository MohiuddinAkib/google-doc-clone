import { wrap } from "lodash";

export const wrapWithArray = <T extends unknown>(value: null | T[] | T) => {
  return wrap<null | T[] | T, null | T[] | T, T[]>(value, function (v) {
    return !v ? [] : Array.isArray(v) ? v : [v];
  })(value);
};
