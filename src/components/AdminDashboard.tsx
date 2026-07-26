"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  addBlockedDate,
  addManualBooking,
  deleteBooking,
  removeBlockedDate,
  updateBookingStatus,
} from "@/app/actions";
import { SERVICES, SERVICE_LABELS } from "@/lib/business";
import type { Booking, BlockedDate, BookingStatus } from "@/lib/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
};

export default function AdminDashboard({
  initialBookings,
  initialBlockedDates,
}: {
  initialBookings: Booking[];
  initialBlockedDates: BlockedDate[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");

  const bookings = initialBookings;
  const blockedDates = initialBlockedDates;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function handleStatusChange(id: string, status: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatus(id, status);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this booking? This can't be undone.")) return;
    startTransition(async () => {
      await deleteBooking(id);
      router.refresh();
    });
  }

  function handleRemoveBlocked(id: string) {
    startTransition(async () => {
      await removeBlockedDate(id);
      router.refresh();
    });
  }

  const visibleBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">York&apos;s Lawn Service — Admin</h1>
          <div className="flex gap-3">
            <a href="/" className="text-sm text-gray-600 hover:underline">
              View site
            </a>
            <button onClick={handleSignOut} className="text-sm font-medium text-red-600 hover:underline">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
        {/* Bookings */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | BookingStatus)}
                className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => setShowAddBooking((v) => !v)}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {showAddBooking ? "Close" : "+ Add Client / Job"}
              </button>
            </div>
          </div>

          {showAddBooking && <AddBookingForm onDone={() => { setShowAddBooking(false); router.refresh(); }} />}

          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                      No bookings yet.
                    </td>
                  </tr>
                )}
                {visibleBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{b.preferred_date}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{b.name}</div>
                      {b.address && <div className="text-xs text-gray-500">{b.address}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {SERVICE_LABELS[b.service] || b.service}
                      {b.yard_size && <div className="text-xs text-gray-500">{b.yard_size} yard</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div>{b.email}</div>
                      {b.phone && <div className="text-xs text-gray-500">{b.phone}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        disabled={isPending}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                        className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[b.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.source}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(b.id)}
                        disabled={isPending}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Blocked dates */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Days Off / Blocked Dates</h2>
          <p className="mt-1 text-sm text-gray-500">
            Block a date to stop customers from booking it online (vacation, weather, fully booked, etc).
          </p>

          <form
            action={(formData) => startTransition(async () => { await addBlockedDate(formData); router.refresh(); })}
            className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                required
                className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-medium text-gray-700">Reason (optional)</label>
              <input
                name="reason"
                placeholder="e.g. Vacation"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Block Date
            </button>
          </form>

          <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {blockedDates.length === 0 && (
              <li className="px-4 py-4 text-sm text-gray-400">No blocked dates.</li>
            )}
            {blockedDates.map((bd) => (
              <li key={bd.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  <span className="font-medium">{bd.date}</span>
                  {bd.reason && <span className="text-gray-500"> — {bd.reason}</span>}
                </span>
                <button
                  onClick={() => handleRemoveBlocked(bd.id)}
                  disabled={isPending}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function AddBookingForm({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError("");
    const result = await addManualBooking(formData);
    setSubmitting(false);
    if (result.ok) {
      onDone();
    } else {
      setError(result.error || "Something went wrong.");
    }
  }

  return (
    <form action={handleSubmit} className="mt-4 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2">
      <div>
        <label className="block text-xs font-medium text-gray-700">Name *</label>
        <input name="name" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Email *</label>
        <input type="email" name="email" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Phone</label>
        <input name="phone" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Preferred / scheduled date *</label>
        <input type="date" name="preferred_date" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Service *</label>
        <select name="service" required defaultValue={SERVICES[0].id} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Yard size</label>
        <select name="yard_size" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">N/A</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700">Address</label>
        <input name="address" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700">Notes</label>
        <textarea name="notes" rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add Booking"}
        </button>
      </div>
    </form>
  );
}
