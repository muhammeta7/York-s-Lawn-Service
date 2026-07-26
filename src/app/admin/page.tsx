import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/AdminDashboard";
import type { Booking, BlockedDate } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();

  const [{ data: bookings }, { data: blockedDates }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .order("preferred_date", { ascending: true }),
    supabase.from("blocked_dates").select("*").order("date", { ascending: true }),
  ]);

  return (
    <AdminDashboard
      initialBookings={(bookings as Booking[]) || []}
      initialBlockedDates={(blockedDates as BlockedDate[]) || []}
    />
  );
}
