export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  yard_size: string | null;
  property_type: string;
  preferred_date: string; // ISO date (YYYY-MM-DD)
  address: string | null;
  notes: string | null;
  status: BookingStatus;
  source: "website" | "admin";
}

export interface BlockedDate {
  id: string;
  date: string; // ISO date
  reason: string | null;
}
