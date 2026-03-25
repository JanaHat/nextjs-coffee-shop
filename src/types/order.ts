export type CheckoutCustomer = {
  fullName: string;
  email: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
};

export type CheckoutItemInput = {
  id: string;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutItemInput[];
  customer: CheckoutCustomer;
  forceResult?: "success" | "failure";
};

export type OrderItem = {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type LastOrder = {
  orderId: string;
  createdAt: string;
  status: "paid";
  customer: CheckoutCustomer;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
};

export type CheckoutSuccessResponse = {
  ok: true;
  status: "paid";
  order: LastOrder;
};

export type CheckoutErrorResponse = {
  ok: false;
  code: "VALIDATION_ERROR" | "PAYMENT_FAILED";
  message: string;
  errors?: Array<{ field: string; message: string }>;
};
