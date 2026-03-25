import { NextResponse } from "next/server";

import { validateCheckoutRequest } from "@/src/lib/checkout-validation";
import { getProductById } from "@/src/lib/products";
import type {
  CheckoutErrorResponse,
  CheckoutSuccessResponse,
  LastOrder,
  OrderItem,
} from "@/src/types/order";

const randomPaymentSucceeded = () => Math.random() >= 0.3;

const createOrderId = () => {
  return `MOCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    const response: CheckoutErrorResponse = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Invalid JSON payload",
    };

    return NextResponse.json(response, { status: 400 });
  }

  const validation = validateCheckoutRequest(body);

  if (!validation.isValid) {
    const response: CheckoutErrorResponse = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Invalid checkout payload",
      errors: validation.errors,
    };

    return NextResponse.json(response, { status: 400 });
  }

  const { items, customer, forceResult } = validation.value;

  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const product = getProductById(item.id);

    if (!product) {
      const response: CheckoutErrorResponse = {
        ok: false,
        code: "VALIDATION_ERROR",
        message: `Product not found: ${item.id}`,
        errors: [{ field: "items", message: `Unknown product id: ${item.id}` }],
      };

      return NextResponse.json(response, { status: 400 });
    }

    orderItems.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    });
  }

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const paymentSucceeded =
    forceResult === "success"
      ? true
      : forceResult === "failure"
        ? false
        : randomPaymentSucceeded();

  if (!paymentSucceeded) {
    const response: CheckoutErrorResponse = {
      ok: false,
      code: "PAYMENT_FAILED",
      message: "Mock payment failed. Please try again.",
    };

    return NextResponse.json(response, { status: 402 });
  }

  const order: LastOrder = {
    orderId: createOrderId(),
    createdAt: new Date().toISOString(),
    status: "paid",
    customer,
    items: orderItems,
    totalItems,
    totalPrice,
  };

  const response: CheckoutSuccessResponse = {
    ok: true,
    status: "paid",
    order,
  };

  return NextResponse.json(response);
}
