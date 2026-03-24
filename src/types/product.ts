export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  detailedDescreption: string;
  tags: string[];
  rating: number;
  imageUrl?: string;
};

export type ProductsApiResponse = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
};
