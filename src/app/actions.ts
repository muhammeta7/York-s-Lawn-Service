"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Public: submit an estimate / booking request from the website.
// ---------------------------------------------------------------------------
export async function createBooking(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const service = String(formData.get("service") || "").trim();
  const yardSize = String(formData.get("yard_size") || "").trim();
  const propertyType = String(formData.get("property_type") || "residential").trim();
  const preferredDate = String(formData.get("preferred_date") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!name || !email || !service || !preferredDate) {
    return { ok: false, error: "Please fill in your name, email, service, and preferred date." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("bookings").insert({
    name,
    email,
    phone: phone || null,
    service,
    yard_size: yardSize || null,
    property_type: propertyType,
    preferred_date: preferredDate,
    address: address || null,
    notes: notes || null,
    status: "pending",
    source: "website",
  });

  if (error) {
    return { ok: false, error: "Something went wrong submitting your request. Please call or try again." };
  }

  revalidatePath("/admin");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Admin-only actions below. Each checks for a logged-in user itself, on top
// of the Supabase row-level-security policies, since RLS would reject the
// write anyway if someone isn't authenticated.
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return supabase;
}

export async function addManualBooking(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const yardSize = String(formData.get("yard_size") || "").trim();
    const propertyType = String(formData.get("property_type") || "residential").trim();
    const preferredDate = String(formData.get("preferred_date") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!name || !email || !service || !preferredDate) {
      return { ok: false, error: "Name, email, service, and date are required." };
    }

    const { error } = await supabase.from("bookings").insert({
      name,
      email,
      phone: phone || null,
      service,
      yard_size: yardSize || null,
      property_type: propertyType,
      preferred_date: preferredDate,
      address: address || null,
      notes: notes || null,
      status: "confirmed",
      source: "admin",
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Not authenticated." };
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Not authenticated." };
  }
}

export async function deleteBooking(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Not authenticated." };
  }
}

export async function addBlockedDate(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const date = String(formData.get("date") || "").trim();
    const reason = String(formData.get("reason") || "").trim();
    if (!date) return { ok: false, error: "Pick a date to block off." };

    const { error } = await supabase.from("blocked_dates").insert({ date, reason: reason || null });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Not authenticated." };
  }
}

export async function removeBlockedDate(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Not authenticated." };
  }
}
