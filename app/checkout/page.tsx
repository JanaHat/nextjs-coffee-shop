"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CheckoutCustomerForm } from "@/app/checkout/_components/CheckoutCustomerForm";
import { CheckoutOrderSummary } from "@/app/checkout/_components/CheckoutOrderSummary";
import { LastOrderPanel } from "@/app/checkout/_components/LastOrderPanel";
import { useAppDispatch, useAppSelector } from "@/src/state/hooks";
import {
  selectCheckoutErrorMessage,
  selectCheckoutSubmitting,
  selectLastOrder,
} from "@/src/state/selectors/checkout-selectors";
import {
  selectBasketHydrated,
  selectBasketItems,
  selectBasketTotalItems,
  selectBasketTotalPrice,
} from "@/src/state/selectors/basket-selectors";
import { clearBasket } from "@/src/state/slices/basket-slice";
import {
  clearCheckoutError,
  checkoutFailed,
  checkoutSucceeded,
  startCheckout,
} from "@/src/state/slices/checkout-slice";
import type {
  CheckoutCustomer,
  CheckoutErrorResponse,
  CheckoutRequest,
  CheckoutSuccessResponse,
} from "@/src/types/order";

const initialCustomer: CheckoutCustomer = {
  fullName: "",
  email: "",
  addressLine1: "",
  city: "",
  postalCode: "",
  country: "United Kingdom",
};

type CheckoutFieldErrors = Partial<Record<keyof CheckoutCustomer, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCustomerFields = (customer: CheckoutCustomer): CheckoutFieldErrors => {
  const errors: CheckoutFieldErrors = {};

  if (!customer.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  }

  if (!customer.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(customer.email.trim())) {
    errors.email = "Please enter a valid email address format.";
  }

  if (!customer.addressLine1.trim()) {
    errors.addressLine1 = "Please enter your address.";
  }

  if (!customer.city.trim()) {
    errors.city = "Please enter your city.";
  }

  if (!customer.postalCode.trim()) {
    errors.postalCode = "Please enter your postal code.";
  }

  if (!customer.country.trim()) {
    errors.country = "Please enter your country.";
  }

  return errors;
};

const mapApiErrorsToFields = (
  errors: CheckoutErrorResponse["errors"],
): CheckoutFieldErrors => {
  const fieldErrors: CheckoutFieldErrors = {};

  if (!errors) {
    return fieldErrors;
  }

  for (const error of errors) {
    const key = error.field.replace("customer.", "") as keyof CheckoutCustomer;

    if (
      key === "fullName" ||
      key === "email" ||
      key === "addressLine1" ||
      key === "city" ||
      key === "postalCode" ||
      key === "country"
    ) {
      fieldErrors[key] = error.message;
    }
  }

  return fieldErrors;
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isHydrated = useAppSelector(selectBasketHydrated);
  const items = useAppSelector(selectBasketItems);
  const totalItems = useAppSelector(selectBasketTotalItems);
  const totalPrice = useAppSelector(selectBasketTotalPrice);

  const isSubmitting = useAppSelector(selectCheckoutSubmitting);
  const errorMessage = useAppSelector(selectCheckoutErrorMessage);
  const lastOrder = useAppSelector(selectLastOrder);

  const displayItems = isHydrated ? items : [];

  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});

  const handleCustomerChange = <K extends keyof CheckoutCustomer>(
    field: K,
    value: CheckoutCustomer[K],
  ) => {
    setCustomer((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return { ...current, [field]: undefined };
    });
    dispatch(clearCheckoutError());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (displayItems.length === 0 || isSubmitting) {
      return;
    }

    const nextFieldErrors = validateCustomerFields(customer);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    dispatch(startCheckout());

    const payload: CheckoutRequest = {
      items: displayItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      customer,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as CheckoutSuccessResponse | CheckoutErrorResponse;

      if (!response.ok || data.ok === false) {
        const message = data.ok === false ? data.message : "Checkout failed.";
        if (data.ok === false) {
          setFieldErrors(mapApiErrorsToFields(data.errors));
        }
        dispatch(checkoutFailed(message));
        return;
      }

      dispatch(checkoutSucceeded(data.order));
      dispatch(clearBasket());
      router.push("/checkout/success");
    } catch {
      dispatch(checkoutFailed("Something went wrong during checkout. Please retry."));
    }
  };

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="app-muted mt-1 text-sm">Guest checkout with mock payment.</p>
        </header>

        {displayItems.length === 0 ? (
          <section className="app-surface rounded-2xl p-8 text-center">
            <p className="app-muted mb-4">Your basket is empty.</p>
            <Link
              href="/products"
              className="app-button-primary inline-flex rounded-lg px-4 py-2 text-sm font-medium"
            >
              Browse products
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <CheckoutCustomerForm
              values={customer}
              fieldErrors={fieldErrors}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              onChange={handleCustomerChange}
              onSubmit={handleSubmit}
            />

            <CheckoutOrderSummary
              items={displayItems}
              totalItems={totalItems}
              totalPrice={totalPrice}
            />
          </div>
        )}

        {lastOrder ? <LastOrderPanel order={lastOrder} /> : null}
      </main>
    </div>
  );
}
