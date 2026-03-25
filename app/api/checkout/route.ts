import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { validateCheckoutRequest } from "@/src/lib/checkout-validation";
import { getProductById } from "@/src/lib/products";
import type {
  CheckoutErrorResponse,
  CheckoutSuccessResponse,
  LastOrder,
  OrderItem,
} from "@/src/types/order";

const createOrderId = () => {
  return `MOCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const toCents = (value: number) => Math.round(value * 100);

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

  const paymentSucceeded = forceResult === "failure" ? false : true;

  if (!paymentSucceeded) {
    const response: CheckoutErrorResponse = {
      ok: false,
      code: "PAYMENT_FAILED",
      message: "Mock payment failed. Please try again.",
    };

    return NextResponse.json(response, { status: 402 });
  }

  const session = await auth();
  let orderId = createOrderId();

  if (session?.user?.id) {
    const persistedOrder = await db.order.create({
      data: {
        userId: session.user.id,
        status: "PAID",
        currency: "GBP",
        totalCents: toCents(totalPrice),
        fullName: customer.fullName,
        email: customer.email,
        addressLine1: customer.addressLine1,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country,
        items: {
          create: orderItems.map((item) => ({
            productId: item.id,
            productName: item.name,
            productBrand: item.brand,
            quantity: item.quantity,
            unitPriceCents: toCents(item.price),
            imageUrl: item.imageUrl,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    orderId = persistedOrder.id;
  }

  const order: LastOrder = {
    orderId,
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
