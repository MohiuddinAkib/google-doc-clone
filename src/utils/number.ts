export const formatNumber = (
  num: number,
  locales?: string | string[] | undefined,
  options?: Intl.NumberFormatOptions | undefined
) => new Intl.NumberFormat(locales, options).format(num);
