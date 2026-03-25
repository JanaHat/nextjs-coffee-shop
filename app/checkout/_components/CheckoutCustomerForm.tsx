import type { CheckoutCustomer } from "@/src/types/order";

type CheckoutFieldErrors = Partial<Record<keyof CheckoutCustomer, string>>;

type CheckoutCustomerFormProps = {
  values: CheckoutCustomer;
  fieldErrors: CheckoutFieldErrors;
  isSubmitting: boolean;
  errorMessage: string | null;
  onChange: <K extends keyof CheckoutCustomer>(field: K, value: CheckoutCustomer[K]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CheckoutCustomerForm({
  values,
  fieldErrors,
  isSubmitting,
  errorMessage,
  onChange,
  onSubmit,
}: CheckoutCustomerFormProps) {
  return (
    <section className="app-surface rounded-2xl p-5 sm:p-6">
      <h2 className="mb-4 text-xl font-semibold">Customer details</h2>

      <form className="grid gap-3" onSubmit={onSubmit} noValidate>
        {fieldErrors.fullName ? (
          <p className="text-sm font-medium text-red-700">{fieldErrors.fullName}</p>
        ) : null}
        <input
          value={values.fullName}
          onChange={(event) => onChange("fullName", event.target.value)}
          className="app-input w-full"
          placeholder="Full name"
        />

        {fieldErrors.email ? (
          <p className="text-sm font-medium text-red-700">{fieldErrors.email}</p>
        ) : null}
        <input
          type="email"
          value={values.email}
          onChange={(event) => onChange("email", event.target.value)}
          className="app-input w-full"
          placeholder="Email"
        />

        {fieldErrors.addressLine1 ? (
          <p className="text-sm font-medium text-red-700">{fieldErrors.addressLine1}</p>
        ) : null}
        <input
          value={values.addressLine1}
          onChange={(event) => onChange("addressLine1", event.target.value)}
          className="app-input w-full"
          placeholder="Address"
        />

        <div className="grid gap-3 sm:grid-cols-3">
          {fieldErrors.city ? (
            <p className="text-sm font-medium text-red-700 sm:col-span-3">{fieldErrors.city}</p>
          ) : null}
          <input
            value={values.city}
            onChange={(event) => onChange("city", event.target.value)}
            className="app-input w-full"
            placeholder="City"
          />

          {fieldErrors.postalCode ? (
            <p className="text-sm font-medium text-red-700 sm:col-span-3">
              {fieldErrors.postalCode}
            </p>
          ) : null}
          <input
            value={values.postalCode}
            onChange={(event) => onChange("postalCode", event.target.value)}
            className="app-input w-full"
            placeholder="Postal code"
          />

          {fieldErrors.country ? (
            <p className="text-sm font-medium text-red-700 sm:col-span-3">{fieldErrors.country}</p>
          ) : null}
          <input
            value={values.country}
            onChange={(event) => onChange("country", event.target.value)}
            className="app-input w-full"
            placeholder="Country"
          />
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-yellow-400 px-4 text-sm font-medium text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : "Pay now (mock)"}
        </button>
      </form>
    </section>
  );
}
