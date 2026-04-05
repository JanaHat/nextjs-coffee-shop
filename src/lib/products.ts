import productsData from "@/data/products.json";

import type { Product } from "@/src/types/product";
import {
  isProductSort,
  type ProductSort,
  type ProductsQuery,
} from "@/src/types/products-query";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

const products: Product[] = productsData as Product[];

const normalize = (value: string) => value.trim().toLowerCase();

const parsePositiveInt = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
};

const parseNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
};

const parseSort = (value: string | null): ProductSort | undefined => {
  if (!value) return undefined;

  if (isProductSort(value)) {
    return value;
  }

  return undefined;
};

export const parseProductsQuery = (searchParams: URLSearchParams): ProductsQuery => {
  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const pageSize = Math.min(
    parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );

  return {
    q: searchParams.get("q")?.trim() || undefined,
    minPrice: parseNumber(searchParams.get("minPrice")),
    maxPrice: parseNumber(searchParams.get("maxPrice")),
    tag: searchParams.get("tag")?.trim() || undefined,
    sort: parseSort(searchParams.get("sort")),
    page,
    pageSize,
  };
};

const matchesSearch = (product: Product, queryText: string) => {
  const needle = normalize(queryText);
  return (
    normalize(product.name).includes(needle) ||
    normalize(product.brand).includes(needle) ||
    product.tags.some((tag) => normalize(tag).includes(needle))
  );
};

const matchesTag = (product: Product, tag: string) => {
  const tagNeedle = normalize(tag);
  return product.tags.some((productTag) => normalize(productTag) === tagNeedle);
};

export const filterProducts = (items: Product[], query: ProductsQuery) => {
  let filtered = [...items];

  if (query.q) {
    const searchQuery = query.q;
    filtered = filtered.filter((product) => matchesSearch(product, searchQuery));
  }

  if (typeof query.minPrice === "number") {
    const minPrice = query.minPrice;
    filtered = filtered.filter((product) => product.price >= minPrice);
  }

  if (typeof query.maxPrice === "number") {
    const maxPrice = query.maxPrice;
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }

  if (query.tag) {
    const tag = query.tag;
    filtered = filtered.filter((product) => matchesTag(product, tag));
  }

  return filtered;
};

export const sortProducts = (items: Product[], sort?: ProductSort) => {
  const sorted = [...items];

  if (sort === "price_asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sort === "rating_desc") {
    sorted.sort((a, b) => b.rating - a.rating);
  }

  return sorted;
};

export const paginateProducts = (items: Product[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export const getProducts = (query: ProductsQuery) => {
  const filtered = filterProducts(products, query);
  const sorted = sortProducts(filtered, query.sort);
  const items = paginateProducts(sorted, query.page, query.pageSize);

  const total = sorted.length;

  return {
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
};

export const getProductById = (id: string) => {
  return products.find((product) => product.id === id);
};

export const getAllProducts = () => {
  return [...products];
};
