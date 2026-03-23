import productsData from "@/data/products.json";

export const getTagOptions = () => {
  const tags = new Set<string>();

  for (const product of productsData) {
    for (const tag of product.tags) {
      tags.add(tag);
    }
  }

  return [...tags].sort((a, b) => a.localeCompare(b));
};

export const toSearchParams = (input: Record<string, string | string[] | undefined>) => {
  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(input)) {
    if (typeof rawValue === "string") {
      params.set(key, rawValue);
      continue;
    }

    if (Array.isArray(rawValue) && rawValue.length > 0) {
      params.set(key, rawValue[0]);
    }
  }

  return params;
};

export const buildProductsHref = (
  current: URLSearchParams,
  updates: Record<string, string | number | undefined>,
) => {
  const params = new URLSearchParams(current);

  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === "undefined" || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `/products?${query}` : "/products";
};
