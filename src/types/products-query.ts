export type ProductSort = "price_asc" | "price_desc" | "rating_desc";

export const PRODUCT_SORT_VALUES: ProductSort[] = [
  "price_asc",
  "price_desc",
  "rating_desc",
];

export const isProductSort = (value: string): value is ProductSort => {
  return PRODUCT_SORT_VALUES.includes(value as ProductSort);
};

export type ProductsQuery = {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  tag?: string;
  sort?: ProductSort;
  page: number;
  pageSize: number;
};
