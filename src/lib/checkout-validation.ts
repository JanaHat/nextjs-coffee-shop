import type { CheckoutRequest } from "@/src/types/order";

type ValidationError = {
  field: string;
  message: string;
};

type ValidationResult =
  | { isValid: true; value: CheckoutRequest }
  | { isValid: false; errors: ValidationError[] };

type CheckoutBodyCandidate = Partial<CheckoutRequest>;

const hasText = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isPositiveInt = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value > 0;

const validateItems = (items: unknown, errors: ValidationError[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    errors.push({ field: "items", message: "At least one checkout item is required" });
    return;
  }

  for (const [index, item] of items.entries()) {
    if (typeof item !== "object" || item === null) {
      errors.push({ field: `items[${index}]`, message: "Item must be an object" });
      continue;
    }

    const entry = item as { id?: unknown; quantity?: unknown };

    if (!hasText(entry.id)) {
      errors.push({ field: `items[${index}].id`, message: "Item id is required" });
    }

    if (!isPositiveInt(entry.quantity)) {
      errors.push({
        field: `items[${index}].quantity`,
        message: "Quantity must be a positive integer",
      });
    }
  }
};

const validateCustomer = (customer: unknown, errors: ValidationError[]) => {
  if (typeof customer !== "object" || customer === null) {
    errors.push({ field: "customer", message: "Customer details are required" });
    return;
  }

  const value = customer as Record<string, unknown>;

  if (!hasText(value.fullName)) {
    errors.push({ field: "customer.fullName", message: "Full name is required" });
  }

  if (!hasText(value.email)) {
    errors.push({ field: "customer.email", message: "Email is required" });
  } else if (!EMAIL_REGEX.test(String(value.email).trim())) {
    errors.push({ field: "customer.email", message: "Email format is invalid" });
  }

  if (!hasText(value.addressLine1)) {
    errors.push({
      field: "customer.addressLine1",
      message: "Address line is required",
    });
  }

  if (!hasText(value.city)) {
    errors.push({ field: "customer.city", message: "City is required" });
  }

  if (!hasText(value.postalCode)) {
    errors.push({ field: "customer.postalCode", message: "Postal code is required" });
  }

  if (!hasText(value.country)) {
    errors.push({ field: "customer.country", message: "Country is required" });
  }
};

const validateForceResult = (value: unknown, errors: ValidationError[]) => {
  if (typeof value === "undefined") {
    return;
  }

  if (value === "success" || value === "failure") {
    return;
  }

  errors.push({
    field: "forceResult",
    message: 'forceResult must be either "success" or "failure"',
  });
};

const toSanitizedCheckoutRequest = (candidate: CheckoutBodyCandidate): CheckoutRequest => {
  const items = Array.isArray(candidate.items) ? candidate.items : [];
  const customer = (candidate.customer ?? {}) as Record<string, unknown>;

  return {
    items: items.map((item) => ({
      id: String((item as { id: string }).id),
      quantity: Number((item as { quantity: number }).quantity),
    })),
    customer: {
      fullName: String(customer.fullName ?? "").trim(),
      email: String(customer.email ?? "").trim(),
      addressLine1: String(customer.addressLine1 ?? "").trim(),
      city: String(customer.city ?? "").trim(),
      postalCode: String(customer.postalCode ?? "").trim(),
      country: String(customer.country ?? "").trim(),
    },
    forceResult: candidate.forceResult,
  };
};

export const validateCheckoutRequest = (body: unknown): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof body !== "object" || body === null) {
    return {
      isValid: false,
      errors: [{ field: "body", message: "Request body must be a valid object" }],
    };
  }

  const candidate = body as CheckoutBodyCandidate;

  validateItems(candidate.items, errors);
  validateCustomer(candidate.customer, errors);
  validateForceResult(candidate.forceResult, errors);

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    value: toSanitizedCheckoutRequest(candidate),
  };
};
