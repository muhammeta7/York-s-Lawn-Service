"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createClient } from "@/lib/supabase/client";
import { createBooking } from "@/app/actions";
import { BUSINESS, SERVICES } from "@/lib/business";

function toIsoDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookingForm() {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [service, setService] = useState<string>(SERVICES[0].id);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .rpc("get_unavailable_dates")
      .then(({ data, error }) => {
        if (!error && data) {
          setUnavailableDates(
            data.map((row: { unavailable_date: string }) => {
              const [y, m, d] = row.unavailable_date.split("-").map(Number);
              return new Date(y, m - 1, d);
            })
          );
        }
        setLoadingDates(false);
      });
  }, []);

  const showsYardSize = service === "mowing";

  const disabledMatchers = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [
      { before: today },
      // Sunday is a day off (business is open Mon-Sat).
      { dayOfWeek: [0] },
      ...unavailableDates,
    ];
  }, [unavailableDates]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedDate) {
      setStatus("error");
      setErrorMessage("Please choose a preferred date.");
      return;
    }
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    formData.set("preferred_date", toIsoDate(selectedDate));

    const result = await createBooking(formData);
    if (result.ok) {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setSelectedDate(undefined);
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">Request received</h3>
        <p className="mt-2 text-[14px] text-gray-500">
          Thanks for reaching out. We&apos;ll follow up by email
          {" "}(and phone, if you gave us one) to confirm your job.
        </p>
        <button
          className="mt-4 text-sm font-medium text-brand-700 hover:underline"
          onClick={() => setStatus("idle")}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-gray-700">Name *</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-[14px] transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-[14px] transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            className="mt-1 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-[14px] transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Property address</label>
          <input
            name="address"
            className="mt-1 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-[14px] transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Service *</label>
          <select
            name="service"
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-[14px] transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {showsYardSize && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Yard size</label>
            <select
              name="yard_size"
              className="mt-1 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-[14px] transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Property type</label>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="property_type" value="residential" defaultChecked />
              Residential
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="property_type" value="commercial" />
              Commercial
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Anything that helps us quote the job accurately"
            className="mt-1 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-[14px] transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred date *</label>
        <div className="inline-block rounded-lg border border-gray-200 bg-white p-2">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledMatchers}
            fromMonth={new Date()}
            className="rdp-brand"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Greyed-out dates are Sundays, already-booked days, or days {BUSINESS.name} has
          marked unavailable. {loadingDates && "Checking current availability…"}
        </p>

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-4 w-full rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-60 md:w-auto"
        >
          {status === "submitting" ? "Sending…" : "Request Estimate / Book Job"}
        </button>
      </div>
    </form>
  );
}
