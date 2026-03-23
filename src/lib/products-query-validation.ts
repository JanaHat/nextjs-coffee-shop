import { PRODUCT_SORT_VALUES, isProductSort } from "@/src/types/products-query";

const MAX_PAGE_SIZE = 50;

type QueryValidationError = {
  param: string;
  message: string;
};

type QueryValidationResult = {
  isValid: boolean;
  errors: QueryValidationError[];
};

const hasValue = (value: string | null) => value !== null && value.trim() !== "";

const isPositiveInteger = (value: string) => /^\d+$/.test(value) && Number(value) > 0;

const isNonNegativeNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
};

const createError = (param: string, message: string): QueryValidationError => ({
  param,
  message,
});

const validateSort = (sort: string | null): QueryValidationError[] => {
  if (!sort || !hasValue(sort) || isProductSort(sort)) {
    return [];
  }

  return [createError("sort", `sort must be one of: ${PRODUCT_SORT_VALUES.join(", ")}`)];
};

const validatePage = (page: string | null): QueryValidationError[] => {
  if (!page || !hasValue(page) || isPositiveInteger(page)) {
    return [];
  }

  return [createError("page", "page must be a positive integer")];
};

const validatePageSize = (pageSize: string | null): QueryValidationError[] => {
  if (!pageSize || !hasValue(pageSize)) {
    return [];
  }

  if (!isPositiveInteger(pageSize)) {
    return [createError("pageSize", "pageSize must be a positive integer")];
  }

  if (Number(pageSize) > MAX_PAGE_SIZE) {
    return [
      createError("pageSize", `pageSize must be less than or equal to ${MAX_PAGE_SIZE}`),
    ];
  }

  return [];
};

const validatePrice = (
  value: string | null,
  key: "minPrice" | "maxPrice",
): QueryValidationError[] => {
  if (!value || !hasValue(value) || isNonNegativeNumber(value)) {
    return [];
  }

  return [createError(key, `${key} must be a non-negative number`)];
};

const validatePriceRange = (
  minPrice: string | null,
  maxPrice: string | null,
): QueryValidationError[] => {
  if (
    !minPrice ||
    !maxPrice ||
    !hasValue(minPrice) ||
    !hasValue(maxPrice) ||
    !isNonNegativeNumber(minPrice) ||
    !isNonNegativeNumber(maxPrice)
  ) {
    return [];
  }

  if (Number(minPrice) <= Number(maxPrice)) {
    return [];
  }

  return [createError("minPrice,maxPrice", "minPrice cannot be greater than maxPrice")];
};

export const validateProductsQuery = (
  searchParams: URLSearchParams,
): QueryValidationResult => {
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const errors = [
    ...validateSort(sort),
    ...validatePage(page),
    ...validatePageSize(pageSize),
    ...validatePrice(minPrice, "minPrice"),
    ...validatePrice(maxPrice, "maxPrice"),
    ...validatePriceRange(minPrice, maxPrice),
  ];

  return {
    isValid: errors.length === 0,
    errors,
  };
};
