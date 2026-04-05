"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { QuestionStep } from "@/app/recommendations/_components/QuestionStep";
import { RecommendationResults } from "@/app/recommendations/_components/RecommendationResults";
import {
  getLatestSavedRecommendationSnapshot,
  type SavedRecommendationSnapshot,
} from "@/src/lib/recommendation-snapshots";
import {
  ACIDITY_PREFERENCE_OPTIONS,
  BREW_METHOD_OPTIONS,
  BUDGET_PREFERENCE_OPTIONS,
  FLAVOUR_OPTIONS,
  ROAST_PREFERENCE_OPTIONS,
  type RecommendationAnswers,
  type RecommendationResponse,
} from "@/src/types/recommendation";

const DEFAULT_ANSWERS: RecommendationAnswers = {
  preferredFlavours: ["chocolate"],
  avoidFlavours: [],
  brewMethod: "any",
  roastPreference: "any",
  acidityPreference: "any",
  budgetPreference: "any",
  intensity: 3,
  decafOnly: false,
};

const toReadableLabel = (value: string) => {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export function RecommendationsPageClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<RecommendationAnswers>(DEFAULT_ANSWERS);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<SavedRecommendationSnapshot | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSavedSnapshot(getLatestSavedRecommendationSnapshot());
  }, []);

  const toggleFlavour = (kind: "preferredFlavours" | "avoidFlavours", flavour: string) => {
    setAnswers((current) => {
      const hasFlavour = current[kind].includes(flavour as (typeof current)[typeof kind][number]);
      const updated = hasFlavour
        ? current[kind].filter((item) => item !== flavour)
        : [...current[kind], flavour];

      if (kind === "preferredFlavours" && updated.length === 0) {
        return current;
      }

      return {
        ...current,
        [kind]: updated,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      const body = await response.json();

      if (!response.ok) {
        setErrorMessage(body.message ?? "Could not generate recommendations.");
        return;
      }

      setResults(body);
    } catch {
      setErrorMessage("Network error while generating recommendations. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleTakeQuizAgain = () => {
    setAnswers(DEFAULT_ANSWERS);
    setResults(null);
    setErrorMessage(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">AI Coffee Questionnaire</h1>
          <p className="app-muted text-sm">
            Tell us what you enjoy and we will suggest five coffees that match your taste.
          </p>
        </header>

        {savedSnapshot ? (
          <section className="app-surface rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Your last saved recommendations</h2>
                <p className="app-muted text-sm">Saved {new Date(savedSnapshot.createdAt).toLocaleString()}</p>
              </div>

              <button
                type="button"
                onClick={handleTakeQuizAgain}
                className="app-button-secondary inline-flex rounded-lg px-3 py-2 text-sm font-medium"
              >
                Take quiz again
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {savedSnapshot.items.slice(0, 5).map((item, index) => (
                <li key={`saved-${item.product.id}`} className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="app-muted text-xs uppercase tracking-wide">#{index + 1} saved match</p>
                    <Link href={`/products/${item.product.id}`} className="text-sm font-medium hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="app-muted text-xs">{item.product.brand}</p>
                  </div>

                  <span className="app-muted text-xs">
                    {formatPrice(item.product.price)} · Score {item.score.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
          <QuestionStep
            title="1) Preferred flavour notes"
            description="Choose up to four flavours you want to taste in your cup."
          >
            <div className="flex flex-wrap gap-2">
              {FLAVOUR_OPTIONS.map((flavour) => {
                const isSelected = answers.preferredFlavours.includes(flavour);

                return (
                  <button
                    key={flavour}
                    type="button"
                    onClick={() => toggleFlavour("preferredFlavours", flavour)}
                    className={[
                      "inline-flex rounded-full border px-3 py-1.5 text-sm transition",
                      isSelected
                        ? "border-yellow-400 bg-yellow-100 text-(--app-text)"
                        : "border-(--app-border) bg-white text-(--app-text) hover:bg-(--app-chip-bg)",
                    ].join(" ")}
                  >
                    {toReadableLabel(flavour)}
                  </button>
                );
              })}
            </div>
          </QuestionStep>

          <QuestionStep
            title="2) Flavours to avoid"
            description="Optional — this helps exclude less suitable coffees."
          >
            <div className="flex flex-wrap gap-2">
              {FLAVOUR_OPTIONS.map((flavour) => {
                const isSelected = answers.avoidFlavours.includes(flavour);

                return (
                  <button
                    key={flavour}
                    type="button"
                    onClick={() => toggleFlavour("avoidFlavours", flavour)}
                    className={[
                      "inline-flex rounded-full border px-3 py-1.5 text-sm transition",
                      isSelected
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-(--app-border) bg-white text-(--app-text) hover:bg-(--app-chip-bg)",
                    ].join(" ")}
                  >
                    {toReadableLabel(flavour)}
                  </button>
                );
              })}
            </div>
          </QuestionStep>

          <QuestionStep title="3) Brewing and profile preferences">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-medium">Brew method</span>
                <select
                  value={answers.brewMethod}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      brewMethod: event.target.value as RecommendationAnswers["brewMethod"],
                    }))
                  }
                  className="app-input w-full rounded-lg px-3 py-2"
                >
                  {BREW_METHOD_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {toReadableLabel(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium">Roast preference</span>
                <select
                  value={answers.roastPreference}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      roastPreference: event.target.value as RecommendationAnswers["roastPreference"],
                    }))
                  }
                  className="app-input w-full rounded-lg px-3 py-2"
                >
                  {ROAST_PREFERENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {toReadableLabel(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium">Acidity preference</span>
                <select
                  value={answers.acidityPreference}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      acidityPreference: event.target.value as RecommendationAnswers["acidityPreference"],
                    }))
                  }
                  className="app-input w-full rounded-lg px-3 py-2"
                >
                  {ACIDITY_PREFERENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {toReadableLabel(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium">Budget tier</span>
                <select
                  value={answers.budgetPreference}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      budgetPreference: event.target.value as RecommendationAnswers["budgetPreference"],
                    }))
                  }
                  className="app-input w-full rounded-lg px-3 py-2"
                >
                  {BUDGET_PREFERENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {toReadableLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </QuestionStep>

          <QuestionStep
            title="4) Strength and extras"
            description="Set your preferred intensity and choose whether you only want decaf options."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-medium">Intensity: {answers.intensity} / 5</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={answers.intensity}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      intensity: Number(event.target.value),
                    }))
                  }
                  className="w-full"
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={answers.decafOnly}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      decafOnly: event.target.checked,
                    }))
                  }
                />
                Decaf only
              </label>
            </div>
          </QuestionStep>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center rounded-lg bg-yellow-400 px-4 text-sm font-medium text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Finding matches..." : "Get recommendations"}
            </button>

            <button
              type="button"
              onClick={() => {
                setAnswers(DEFAULT_ANSWERS);
                setResults(null);
                setErrorMessage(null);
              }}
              className="app-button-secondary inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
            >
              Reset
            </button>

            <Link
              href="/products"
              className="app-button-secondary inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
            >
              Browse all products
            </Link>
          </div>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        </form>

        {results ? (
          <RecommendationResults
            items={results.items}
            onSaved={() => {
              setSavedSnapshot(getLatestSavedRecommendationSnapshot());
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
